import {cloneDeep} from 'lodash';
import {Encounter, PlayerStats} from './encounter';

export type State = {
    players: {
        [id: string]: {
            stats: PlayerStats
        }
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
        case 'SET STATS':
            const {playerId, ...stats} = action.payload;
            const state1 = cloneDeep(state);
            state1.players[playerId].stats = stats;
            return state1;
        default:
            return state;
    }
}
