import {Encounter} from '../model/encounter';
import {User} from '../model/user';
import {getCampaign} from './campaign';
import {HttpError} from '../middlewares/error-middleware';
import {assign, filter, find, map, pick, some} from 'lodash';
import {broadcastEvent} from './socket';
import {Log} from '../model/log';
import {addFeatures, getFeatures, removePlayers} from './feature';
import {Feature} from '../model/feature';

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
    const encounter = await Encounter.findOne(id, {relations: ['campaign', 'features']});
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

export async function toggleActiveEncounter(id: string, user: User): Promise<void> {
    const encounter = await getEncounter(id);
    if (encounter.campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t modify encounters in it!');
    const campaign = await getCampaign(encounter.campaign.id, ['users', 'encounters', 'encounters.features']);
    const before = map(campaign.encounters, e => pick(e, ['id', 'name', 'active']));

    const playerIds = campaign.users
        .filter(user => user.id !== campaign.gm.id)
        .map(user => user.id);
    await Promise.all(campaign.encounters.map(async enc => {
        enc.active = enc.id === id && !enc.active;
        if (!enc.active) {
            await removePlayers(enc.id, playerIds);
        } else {
            const addedPlayers = campaign.users.filter(u => u.id !== encounter.campaign.gm.id)
                .map(u => ({
                    type: 'player',
                    reference: u.id,
                    AC: 15,
                    HP: 10,
                    initialHP: 10,
                } as Partial<Feature>));
            await addFeatures(enc.id, {features: addedPlayers});
        }
    }));
    await campaign.save();

    const changed = filter(campaign.encounters, a => {
        const b = find(before, ['id', a.id]);
        return b?.active !== a.active;
    });
    const off = find(changed, enc => !enc.active);
    if (off)
        await pushEncounterOverSockets(off.id);
    const on = find(changed, enc => enc.active);
    if (on)
        await pushEncounterOverSockets(on.id);
}

export async function getActiveEncounter(campaignId: string): Promise<Encounter> {
    const campaign = await getCampaign(campaignId);
    const encounter = campaign.encounters.find(encounter => encounter.active);
    if (!encounter)
        throw new HttpError(404, `Campaign with id ${campaignId} doesn't have active encounter`);
    return encounter;
}

export async function pushEncounterOverSockets(encounterId: string) {
    const encounter = await getEncounter(encounterId);
    broadcastEvent(
        'encounter',
        encounter.active ? encounter : null,
        encounter.campaign.users.map(u => u.id),
    );
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
    // broadcastEncounter(encounter);
}
