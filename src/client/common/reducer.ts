import {cloneDeep} from 'lodash';
import {Encounter, Player} from './encounter';

export type State = {
    players: {
        [id: string]: Player
    },
    encounter?: Encounter,
}

export type Action = {
    type: string;
    payload?: any;
}

export function reducer(state: State = {players: {}}, action: Action) {
    switch (action.type) {
        case 'SET STATE':
            return action.payload;
        case 'START ENCOUNTER':
            if (state.encounter)
                return state;
            return {
                ...state,
                encounter: action.payload,
            };
        case 'FINISH ENCOUNTER':
            if (!state.encounter)
                return state;
            return {
                ...state,
                encounter: undefined,
            };
        case 'SET PHASE':
            if (!state.encounter)
                return state;
            return {
                ...state,
                encounter: {
                    ...state.encounter,
                    phase: action.payload,
                },
            };
        case 'ATTACK': {
            if (!state.encounter)
                return state;
            const {playerId, log} = action.payload;
            const state1 = cloneDeep(state);
            state1.players[playerId].actionLog = state1.players[playerId].actionLog || [];
            state1.players[playerId].actionLog.push(log);
            return state1;
        }

        case 'CONNECT':
            return {
                ...state,
                players: {
                    ...state.players,
                    [action.payload.id]: action.payload.data,
                },
            };
        case 'DISCONNECT':
            const players = {
                ...state.players,
            };
            delete players[action.payload];
            return {
                ...state,
                players,
            };
        case 'SET STATS': {
            const {playerId, ...stats} = action.payload;
            const state1 = cloneDeep(state);
            state1.players[playerId].stats = stats;
            return state1;
        }
        default:
            return state;
    }
}
