import {Encounter} from '../model/encounter';
import {User} from '../model/user';
import {getCampaign, pushCampaignOverSockets} from './campaign';
import {HttpError} from '../middlewares/error-middleware';
import {assign, difference, filter, find, isNil, map, pick, reject} from 'lodash';
import {broadcastObject} from './socket';
import {AddFeature, addFeatures} from '../repo/feature';
import * as repo from '../repo/encounter';
import {validateObject} from '../middlewares/validators';
import {getManager} from 'typeorm';
import {Feature} from '../model/feature';

export async function createEncounter(campaignId: string, user: User, body: Partial<Encounter>): Promise<Encounter> {
    body = validateObject(body, ['name']);
    const campaign = await getCampaign(campaignId);
    if (campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t create encounter in it!');
    const encounter = new Encounter();
    encounter.campaign = campaign;
    assign(encounter, body);
    await encounter.save();
    return encounter;
}

export async function getEncounters(campaignId: string): Promise<Encounter[]> {
    const campaign = await getCampaign(campaignId);
    return campaign.encounters;
}

export async function getFullEncounter(encounterId: string): Promise<Encounter> {
    const encounter = await Encounter.createQueryBuilder('encounter')
        .leftJoinAndSelect('encounter.campaign', 'campaign')
        .leftJoinAndSelect('campaign.gm', 'gm')
        .leftJoinAndSelect('encounter.features', 'feature')
        .leftJoinAndSelect('feature.monster', 'monster')
        .leftJoinAndSelect('feature.player', 'player')
        .leftJoinAndSelect('encounter.logs', 'log')
        .leftJoinAndSelect('log.source', 'source')
        .leftJoinAndSelect('log.target', 'target')
        .where('encounter.id = :encounterId', {encounterId})
        .getOne();

    if (!encounter)
        throw new HttpError(404, `Encounter with id ${encounterId} not found`);

    function toFullFeatures(encounter: Encounter, partialFeatures?: Feature[]) {
        return map(partialFeatures, f => {
            const f1 = find(encounter.features, ['id', f.id]);
            if (isNil(f1))
                throw new HttpError(404, `Feature with id ${f.id} not found`);
            return f1;
        });
    }

    encounter.logs.forEach(log => {
        log.source = toFullFeatures(encounter, log.source);
        log.target = toFullFeatures(encounter, log.target);
    })

    return encounter;
}

export async function updateEncounter(encounterId: string, body: Partial<Encounter>): Promise<Encounter> {
    const encounter = await repo.getEncounter(encounterId);
    assign(encounter, body);
    await encounter.save();
    await pushEncounterOverSockets(encounter.id);
    return encounter;
}

export async function deleteEncounter(encounterId: string, user: User): Promise<void> {
    const encounter = await repo.getEncounter(encounterId, ['campaign']);
    if (encounter.campaign.gm.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t delete encounter in it!');
    await Encounter.remove(encounter);
    await pushCampaignOverSockets(encounter.campaign.id);
}

export async function toggleActiveEncounter(encounterId: string, user: User): Promise<void> {
    const encounter = await repo.getEncounter(
        encounterId,
        ['campaign'],
    );
    if (encounter?.campaign?.gm?.id !== user.id)
        throw new HttpError(403, 'You are not GM of this campaign, you can\'t modify encounters in it!');
    const campaign = encounter.campaign;
    const encounters = await Encounter.find({
        where: {campaign: {id: campaign.id}},
        relations: ['features'],
    });
    const before = map(campaign.encounters, e => pick(e, ['id', 'name', 'active']));

    const playerIds = campaign.users
        .filter(user => user.id !== campaign.gm.id)
        .map(user => user.id);
    await Promise.all(campaign.encounters.map(async enc => {
        const fullEnc = find(encounters, ['id', enc.id]);
        if (isNil(fullEnc))
            return;
        enc.active = enc.id === encounterId && !enc.active;
        if (enc.active) {
            const playersInEncounter = reject(map(fullEnc.features, 'player.id'), isNil);
            const notInEncounter = difference(playerIds, playersInEncounter);
            const addedPlayers = notInEncounter
                .map(id => ({
                    type: 'player',
                    reference: id,
                    AC: 15,
                    HP: 10,
                    initialHP: 10,
                } as AddFeature));
            await addFeatures(enc.id, addedPlayers);
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

export async function notifyUserOfActiveEncounter(userId: string): Promise<void> {
    const encounter = await getManager().createQueryBuilder(Encounter, 'encounter')
        .leftJoin('encounter.campaign', 'campaign')
        .leftJoin('campaign.users', 'user')
        .where('encounter.active = :active', {active: true})
        .andWhere('user.id = :userId', {userId})
        .getOne();
    if (!isNil(encounter))
        await pushEncounterOverSockets(encounter.id);
}

export async function pushEncounterOverSockets(encounterId: string) {
    const encounter = await getFullEncounter(encounterId);
    const users = await Encounter.affectedUsers(encounterId)
    broadcastObject(
        Encounter.name,
        encounter,
        users,
    );
}
