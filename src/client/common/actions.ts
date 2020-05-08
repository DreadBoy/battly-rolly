import {Action} from './reducer';
import {ActionLog, Encounter, PlayerStats} from '../../server/encounter';

export type StartEncounter = Action & {
    payload: Encounter,
}

export type Attack = Action & {
    payload: {
        playerId: string,
        log: ActionLog,
    },
}

export type SetStats = Action & {
    payload: PlayerStats & {
        playerId: string,
    },
}

export type QueueAction = Action & {
    payload: ActionLog[],
}

export type ConfirmLog = Action & {
    payload: {
        playerId: string,
    }
}

export type ResolveSave = Action & {
    payload: {
        playerId: string,
        roll: number,
    }
}
