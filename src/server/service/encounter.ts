import {Encounter} from '../model/encounter';
import {User} from '../model/user';
import {getCampaign, pushCampaignOverSockets} from './campaign';
import {HttpError} from '../middlewares/error-middleware';
import {assign, filter, find, map, pick} from 'lodash';
import {broadcastObject} from './socket';
import {AddFeature} from '../repo/feature';
import * as repo from '../repo/feature';
import {validateObject} from '../middlewares/validators';

export async function createEncounter(campaignId: string, user: User, body: Partial<Encounter>): Promise<Encounter> {
    body = validateObject(body, ['name']);
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

export async function getEncounter(encounterId: string): Promise<Encounter> {
    const encounter = await Encounter.findOne(encounterId, {
        relations: [
            'campaign',
            'features', 'features.monster', 'features.player',
            'logs', 'logs.source', 'logs.target',
        ],
    });
    if (!encounter)
        throw new HttpError(404, `Encounter with id ${encounterId} not found`);
    return encounter;
}

export async function updateEncounter(encounterId: string, body: Partial<Encounter>): Promise<Encounter> {
    const encounter = await getEncounter(encounterId);
    assign(encounter, body);
    await encounter.save();
    await pushEncounterOverSockets(encounter.id);
    return encounter;
}

export async function deleteEncounter(encounterId: string, user: User): Promise<void> {
    const encounter = await getEncounter(encounterId);
    if (encounter.campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t delete encounter in it!');
    await Encounter.remove(encounter);
    await pushCampaignOverSockets(encounter.campaign.id);
}

export async function toggleActiveEncounter(encounterId: string, user: User): Promise<void> {
    const encounter = await getEncounter(encounterId);
    if (encounter.campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t modify encounters in it!');
    const campaign = await getCampaign(encounter.campaign.id, ['users', 'encounters', 'encounters.features']);
    const before = map(campaign.encounters, e => pick(e, ['id', 'name', 'active']));

    const playerIds = campaign.users
        .filter(user => user.id !== campaign.gm.id)
        .map(user => user.id);
    await Promise.all(campaign.encounters.map(async enc => {
        enc.active = enc.id === encounterId && !enc.active;
        if (!enc.active) {
            await repo.removePlayers(enc.id, playerIds);
        } else {
            const addedPlayers = campaign.users.filter(u => u.id !== encounter.campaign.gm.id)
                .map(u => ({
                    type: 'player',
                    reference: u.id,
                    AC: 15,
                    HP: 10,
                    initialHP: 10,
                } as AddFeature));
            await repo.addFeatures(enc.id, addedPlayers);
        }
    }));
    await campaign.save();

    const changed = filter(campaign.encounters, a => {
        const b = find(before, ['id', a.id]);
        return b?.active !== a.active;
    });
    for (const {id} of changed)
        await pushEncounterOverSockets(id);
    if (changed.length > 0)
        await pushCampaignOverSockets(campaign.id);
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
    const users = await Encounter.affectedUsers(encounterId)
    broadcastObject(
        Encounter.name,
        encounter,
        users,
    );
}
