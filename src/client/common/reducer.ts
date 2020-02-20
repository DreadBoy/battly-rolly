import {cloneDeep, filter, find, first, pull, sum} from 'lodash';
import {Encounter, isAttackLog, isSaveLog, Player, SaveLog} from './encounter';
import {Attack, ConfirmLog, QueueAction, ResolveSave, SetStats, StartEncounter} from './actions';
import {roll} from './roll';

export type State = {
    players: {
        [id: string]: Player
    },
    encounter?: Encounter,
}

export type Action = {
    type: string;
}

export function reducer(state: State = {players: {}}, action: Action) {
    switch (action.type) {
        case 'SET STATE':
            // @ts-ignore
            return action.payload;
        case 'SET PHASE':
            if (!state.encounter)
                return state;
            return {
                ...state,
                encounter: {
                    ...state.encounter,
                    // @ts-ignore
                    phase: action.payload,
                },
            };
        case 'CONNECT':
            return {
                ...state,
                players: {
                    ...state.players,
                    // @ts-ignore
                    [action.payload.id]: action.payload.data,
                },
            };
        case 'DISCONNECT':
            const players = {
                ...state.players,
                // @ts-ignore
                [action.payload]: {},
            };
            return {
                ...state,
                players,
            };
        case 'CONFIRM LOG': {
            const act = action as ConfirmLog;
            const state1 = cloneDeep(state);
            const playerId = act.payload.playerId;
            state1.players[playerId].actionLog = filter(state1?.players[playerId]?.actionLog, l => !isAttackLog(l));
            return state1;
        }
        case 'START ENCOUNTER': {
            if (state.encounter)
                return state;
            return {
                ...state,
                encounter: (action as StartEncounter).payload,
            };
        }
        case 'FINISH ENCOUNTER': {
            if (!state.encounter)
                return state;
            return {
                ...state,
                encounter: undefined,
            };
        }
        case 'ATTACK': {
            if (!state.encounter)
                return state;
            const {playerId, log} = (action as Attack).payload;
            const state1 = cloneDeep(state);
            state1.players[playerId].actionLog = state1.players[playerId].actionLog || [];
            state1.players[playerId].actionLog.push(log);
            return state1;
        }
        case 'SET STATS': {
            const {playerId, ...stats} = (action as SetStats).payload;
            const state1 = cloneDeep(state);
            state1.players[playerId].stats = stats;
            return state1;
        }
        case 'QUEUE ACTION': {
            if (!state.encounter)
                return state;
            const state1 = cloneDeep(state);
            (action as QueueAction).payload.forEach(log => {
                const monster = find(state1.encounter?.monsters, ['id', log.targetId]);
                if (!monster)
                    return;
                monster.actionLog = (monster.actionLog || []).concat(log);

            });
            return state1;
        }
        case 'RESOLVE QUEUE': {
            if (!state.encounter)
                return state;
            const state1 = cloneDeep(state);
            state1.encounter?.monsters.forEach(m => {
                if (m.actionLog?.length === 0)
                    return;
                m.actionLog?.forEach(al => {
                    // TODO account for damage immunity/resistance
                    if (isAttackLog(al)) {
                        m.currentHP -= al.damageRoll;
                    } else if (isSaveLog(al)) {
                        al.saveRoll = roll([1, 20, m.savingThrows[al.save.ability]]);
                        al.success = al.saveRoll > al.save.DC;
                        const damage = al.success ? al.save.damageSuccess : al.save.damageFailure;
                        m.currentHP -= sum(damage?.rolls.map(roll)) || 0;
                    }
                });
                m.actionLog = [];
            });
            return state1;
        }
        case 'RESOLVE SAVE': {
            if (!state.encounter)
                return state;
            const {payload: {playerId, roll}} = action as ResolveSave;
            const state1 = cloneDeep(state);
            const firstSave = first(filter(state1.players[playerId].actionLog, isSaveLog)) as SaveLog;
            if (typeof firstSave === 'undefined')
                return state;
            if (roll < firstSave.save.DC) {
                firstSave.saveRoll = roll;
                firstSave.success = false;
                return state;
            }
            pull(state1.players[playerId].actionLog, firstSave);
            return state1;
        }
    }

    return state;
}
