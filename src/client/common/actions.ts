import {Action} from './reducer';
import {ActionLog, Encounter, PlayerStats} from './encounter';

export type StartEncounter = Action & {
    payload: Encounter,
}

export function isStartEncounter(action: Action): action is StartEncounter {
    return action.type === 'START ENCOUNTER';
}

export type FinishEncounter = Action & {
    payload: undefined,
}

export function isFinishEncounter(action: Action): action is FinishEncounter {
    return action.type === 'FINISH ENCOUNTER';
}

export type Attack = Action & {
    payload: {
        playerId: string,
        log: ActionLog,
    },
}

export function isAttack(action: Action): action is Attack {
    return action.type === 'ATTACK';
}

export type SetStats = Action & {
    payload: PlayerStats & {
        playerId: string,
    },
}

export function isSetStats(action: Action): action is SetStats {
    return action.type === 'SET STATS';
}

export type QueueAction = Action & {
    payload: ActionLog[],
}

export function isQueueAction(action: Action): action is QueueAction {
    return action.type === 'QUEUE ACTION';
}

export type ResolveQueue = Action

export function isResolveQueue(action: Action): action is ResolveQueue {
    return action.type === 'RESOLVE QUEUE';
}
