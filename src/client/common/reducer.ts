export type State = {
    phase: 0 | 1 | 2 | 3;
}

export type Action = {
    type: string;
    payload?: any;
}

export function reducer(state: State = {phase: 0}, action: Action) {
    return state;
}
