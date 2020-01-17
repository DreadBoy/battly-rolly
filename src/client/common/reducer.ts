export type State = {
    phase: 0 | 1 | 2 | 3;
    players: { [id: string]: any },
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
        default:
            return state;
    }
}
