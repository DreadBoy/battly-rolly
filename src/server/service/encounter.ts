import {Encounter} from '../model/encounter';
import {User} from '../model/user';
import {getCampaign} from './campaign';
import {HttpError} from '../middlewares/error-middleware';
import {assign, some} from 'lodash';
import {broadcastState} from './socket';
import {Log} from '../model/log';
import {getFeatures} from './feature';

export async function createEncounter(campaignId: string, user: User, body: Partial<Encounter>): Promise<Encounter> {
    const campaign = await getCampaign(campaignId);
    if (campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t create encounter in it!');
    const encounter = new Encounter();
    encounter.campaign = campaign;
    assign(encounter, body);
    await encounter.save();
    delete encounter.campaign;
    return encounter;
}

export async function getEncounters(campaignId: string): Promise<Encounter[]> {
    const campaign = await getCampaign(campaignId);
    return campaign.encounters;
}

export async function getEncounter(id: string): Promise<Encounter> {
    const encounter = await Encounter.findOne(id, {relations: ['campaign']});
    if (!encounter)
        throw new HttpError(404, `Encounter with id ${id} not found`);
    return encounter;
}

export async function updateEncounter(id: string, body: Partial<Encounter>): Promise<Encounter> {
    const encounter = await getEncounter(id);
    assign(encounter, body);
    await encounter.save();
    return encounter;
}

export async function deleteEncounter(encounterId: string, user: User): Promise<void> {
    const encounter = await getEncounter(encounterId);
    if (encounter.campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t delete encounter in it!');
    await Encounter.remove(encounter);
}

export async function setActiveEncounter(id: string, user: User): Promise<void> {
    const encounter = await getEncounter(id);
    if (encounter.campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t modify encounters in it!');
    encounter.campaign.encounters.forEach(encounter => encounter.active = encounter.id === id);
    await encounter.campaign.save();
}

export async function getActiveEncounter(campaignId: string): Promise<Encounter> {
    const campaign = await getCampaign(campaignId);
    const encounter = campaign.encounters.find(encounter => encounter.active);
    if (!encounter)
        throw new HttpError(404, `Campaign with id ${campaignId} doesn't have active encounter`);
    return encounter;
}

export async function createLog(encounterId: string, user: User, body: { source: string[], target: string[] }) {
    const encounter = await getEncounter(encounterId);
    if (!some(encounter.campaign.users, ['id', user.id]))
        throw new HttpError(403, 'You are not part of this campaign, you can\'t act in it!');
    const log = new Log();
    const source = await getFeatures(body.source);
    const target = await getFeatures(body.target);
    assign(log, {
        source,
        target,
    });
    await log.save();
    encounter.logs.push(log);
    await encounter.save();
    broadcastState(JSON.stringify(encounter), ...encounter.campaign.users.map(u => u.id));
}
