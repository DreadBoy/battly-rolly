import {Action} from './action';
import {isNil} from 'lodash';
import {Feature, FeatureType} from './feature';
import {IAoE, IDirect} from './action-types';

// @ts-ignore
export function isDirect(action: Action): action is IDirect {
    return action.type === 'direct';
}

// @ts-ignore
export function isAoe(action: Action): action is IAoE {
    return action.type === 'aoe';
}

export function type(feature: Feature): FeatureType {
    if (!isNil(feature.player))
        return 'player'
    return 'npc';
}

export function hasPlayer(playerId: string) {
    return (feature: Feature) => feature.player?.id === playerId;
}
