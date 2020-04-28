import {find} from 'lodash';
import {Monster} from '../../../server/model/monster';
import {Ability, Action} from '../../../server/model/action';
import {User} from '../../../server/model/user';

export const abilities: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

export function findAction(monster: Monster | User | undefined, actionName: string | undefined): Action | undefined {
    // TODO What if GM make attack from player to player, we should also be expecting User in here.
    // This case isn't likely o happen but it's possible
    // @ts-ignore
    return find(monster?.actions, ['name', actionName]);
}

export function statToModifier(stat: number) {
    return Math.floor(stat / 2) - 5
}
