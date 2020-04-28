import {find} from 'lodash';
import {Monster} from '../../../server/model/monster';
import {Ability, Action} from '../../../server/model/action';

export const abilities: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

export function findMonster(name: string | undefined): Monster | undefined {
    return undefined;
}

export function findAction(monsterName: string | undefined, actionName: string | undefined): Action | undefined {
    return find(findMonster(monsterName)?.actions, ['name', actionName]);
}

export function statToModifier(stat: number) {
    return Math.floor(stat / 2) - 5
}
