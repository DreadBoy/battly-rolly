import {cloneDeep} from 'lodash';

export type State = {
    phase: 0 | 1 | 2 | 3;
    players: {
        [id: string]: {
            stats: PlayerStats
        }
    },
}

export type PlayerStats = {
    AC: number,
}

export type Action = {
    type: string;
    payload?: any;
}

export function reducer(state: State = {phase: 0, players: {}}, action: Action) {
    switch (action.type) {
        case 'SET STATE':
            return action.payload;
        case 'SET PHASE':
            return {
                ...state,
                phase: action.payload,
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
