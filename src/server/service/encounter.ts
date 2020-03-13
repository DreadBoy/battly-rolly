import {Encounter} from '../model/encounter';
import {User} from '../model/user';
import {getCampaign} from './campaign';
import {HttpError} from '../middlewares/error-middleware';
import {some} from 'lodash';
import {broadcastState} from './socket';
import {Encounter as EncounterData} from './encounter-data';

export async function createEncounter(campaignId: string, user: User): Promise<Encounter> {
    const campaign = await getCampaign(campaignId);
    if (campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t create encounter in it!');
    const encounter = new Encounter();
    encounter.campaign = campaign;
    await encounter.save();
    delete encounter.campaign;
    return encounter;
}

export async function getEncounters(campaignId: string): Promise<Encounter[]> {
    const campaign = await getCampaign(campaignId);
    return campaign.encounters;
}

async function getEncounter(id: string): Promise<Encounter> {
    const encounter = await Encounter.findOne(id, {relations: ['campaign']});
    if (!encounter)
        throw new HttpError(404, `Encounter with id ${id} not found`);
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

export type Action = {
    type: string;
}

function reducer(state: EncounterData, action: Action) {
    if (action.type === 'INIT')
        return {
            version: 1,
            entities: [],
            log: [],
        };
    if (state.version !== 1)
        throw new HttpError(400, 'You are trying to act in outdated encounter, delete it and create new one.');
    return state;
}

export async function applyAction(encounterId: string, action: Action, user: User) {
    const encounter = await getEncounter(encounterId);
    if (!some(encounter.campaign.users, ['id', user.id]))
        throw new HttpError(403, 'You are not part of this campaign, you can\'t act in it!');
    const state = reducer(JSON.parse(encounter.data), action);
    encounter.data = JSON.stringify(state);
    await encounter.save();
    broadcastState(state, ...encounter.campaign.users.map(u => u.id));
}
