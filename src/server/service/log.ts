import {Log, LogStage, LogType} from '../model/log';
import {User} from '../model/user';
import {assign, constant, difference, every, findIndex, isEmpty, isNil, map, negate, pick, some, times} from 'lodash';
import {HttpError} from '../middlewares/error-middleware';
import {getFeatures} from './feature';
import {getEncounter, pushEncounterOverSockets} from './encounter';
import {Ability, Status} from '../encounter';
import {validateObject} from '../middlewares/validators';
import {DamageType} from '../model/action-types';

export async function getLogsInEncounter(encounterId: string): Promise<Log[]> {
    return Log.find({where: {encounter: {id: encounterId}}});
}

export async function getLog(id: string, relations: string[] = ['encounter']): Promise<Log> {
    const log = await Log.findOne(id, {relations});
    if (!log)
        throw new HttpError(404, `Log with id ${id} not found`);
    return log;
}

export type StartLog = {
    source: string[],
    target: string[],
    type: LogType,
    name: string,

    attack?: number,

    DC?: number,
    stat?: Ability,
};

export async function startLog(encounterId: string, user: User, body: StartLog) {
    const encounter = await getEncounter(encounterId);
    if (!some(encounter.campaign.users, ['id', user.id]))
        throw new HttpError(403, 'You are not part of this campaign, you can\'t act in it!');
    if (body.type === 'direct')
        validateObject(body, ['attack']);
    else if (body.type === 'aoe')
        validateObject(body, ['stat', 'DC']);
    const notInCampaign = difference(body.source.concat(body.target), map(encounter.features, 'id'));
    if (notInCampaign.length > 0)
        throw new HttpError(403, `Features ${notInCampaign.join(', ')} aren't part of this campaign!`);

    validateObject(body, ['source', 'target', 'type', 'name']);
    if (isEmpty(body.source))
        throw new HttpError(401, `Source array is empty, something went wrong on your side!`);
    if (isEmpty(body.target))
        throw new HttpError(401, `Target array is empty, something went wrong on your side!`);
    const log = new Log();
    const source = await getFeatures(body.source);
    const target = await getFeatures(body.target);
    assign(log, {
        source,
        target,
        success: times(target.length, constant(null)),
        throw: times(target.length, constant(null)),
        type: body.type,
        name: body.name,
        stage: 'WaitingOnResult',
        confirmed: times(target.length, constant(null)),
    } as Partial<Log>);
    if (body.type === 'direct')
        assign(log, pick(body, ['attack']));
    else if (body.type === 'aoe')
        assign(log, pick(body, ['stat', 'DC']));

    await log.save();
    encounter.logs.push(log);
    await encounter.save();
    await pushEncounterOverSockets(encounter.id);
    return log;
}

async function getVerifyLog(logId: string, userId: string, expectedStage: LogStage): Promise<Log> {
    const log = await getLog(logId, ['encounter', 'encounter.campaign', 'source', 'target']);
    if (!some(log.encounter.campaign.users, ['id', userId])) {
        throw new HttpError(403, 'You are not part of this campaign, you can\'t act in it!');
    }
    if (log.stage !== expectedStage)
        throw new HttpError(401, `Log is expected to be in ${expectedStage} but is in ${log.stage}`);
    return log;
}

function validateTarget(log: Log, featureId: string) {
    const index = findIndex(log.target, ['id', featureId])
    if (index === -1)
        throw new HttpError(401, `${featureId} isn't among targets in this attack!`);
    return index;
}

export type ResolveResult = {
    featureId: string,

    success?: boolean,

    throw?: number,
}

export async function resolveResult(logId: string, user: User, body: ResolveResult) {
    const log = await getVerifyLog(logId, user.id, 'WaitingOnResult');
    const index = validateTarget(log, validateObject(body, ['featureId']).featureId);
    if (log.type === 'direct') {
        log.success[index] = validateObject(body, ['success']).success;
        if (log.success[index])
            log.stage = 'WaitingOnDamage';
        else
            log.stage = 'Confirmed';
    } else if (log.type === 'aoe') {
        log.throw[index] = validateObject(body, ['throw']).throw;
        log.success[index] = log.DC > (log.throw[index] as number);
        if (every(log.success, negate(isNil)))
            // Sometimes AoE spells will deal damage/status even if target successfully saved
            log.stage = 'WaitingOnDamage';
    }

    await log.save();
    await pushEncounterOverSockets(log.encounter.id);
}

export type DealDamage = {
    damageSuccess?: number,
    damageFailure?: number,
    damageType?: DamageType,
    status?: Status,
}

export async function dealDamage(logId: string, user: User, body: DealDamage) {
    const log = await getVerifyLog(logId, user.id, 'WaitingOnDamage');
    body = validateObject(body, ['damageSuccess', 'damageType'], ['damageFailure', 'status']);

    assign(log, body);

    if (log.damageFailure > 0 || log.damageSuccess > 0 || !isNil(log.status))
        log.stage = 'WaitingOnConfirmed';
    else
        log.stage = 'Confirmed';

    await log.save();
    await pushEncounterOverSockets(log.encounter.id);
}

export type ConfirmDamage = {
    featureId: string,
}

export async function confirmDamage(logId: string, user: User, body: ConfirmDamage) {
    const log = await getVerifyLog(logId, user.id, 'WaitingOnConfirmed');
    const index = validateTarget(log, validateObject(body, ['featureId']).featureId);

    log.confirmed[index] = true;
    if (every(log.confirmed, Boolean))
        log.stage = 'Confirmed';

    await log.save();
    await pushEncounterOverSockets(log.encounter.id);
}
