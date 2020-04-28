import {Action, IAoE, IDirect} from './action';

// @ts-ignore
export function isDirect(action: Action): action is IDirect {
    return action.type === 'direct';
}

// @ts-ignore
export function isAoe(action: Action): action is IAoE {
    return action.type === 'aoe';
}
