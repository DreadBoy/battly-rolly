import {Monster} from './monster';
import {User} from './user';
import {find} from 'lodash';
import {Action} from './action';

export type Roll = [number, number, number];
export type Damage = {
    roll: Roll,
    damageType: DamageType,
}
export type ActionType = 'direct' | 'aoe';
export type AbilitySet = {
    strength: number,
    dexterity: number,
    constitution: number,
    intelligence: number,
    wisdom: number,
    charisma: number,
}
export type DamageType =
    'acid'
    | 'bludgeoning'
    | 'cold'
    | 'fire'
    | 'force'
    | 'lightning'
    | 'necrotic'
    | 'piercing'
    | 'poison'
    | 'psychic'
    | 'radiant'
    | 'slashing'
    | 'thunder'
export type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
export type Status = 'blinded'
    | 'charmed'
    | 'deafened'
    | 'fatigued'
    | 'frightened'
    | 'grappled'
    | 'incapacitated'
    | 'invisible'
    | 'paralyzed'
    | 'petrified'
    | 'poisoned'
    | 'prone'
    | 'restrained'
    | 'stunned'
    | 'unconscious'
    | 'exhaustion';

export interface IDirect {
    type: 'direct',
    name: string,
    modifier: number,
    damage: Damage,
}

export interface IAoE {
    type: 'aoe',
    name: string,
    DC: number,
    ability: Ability,
    damage: Damage,
    takeHalfOnFailure: boolean,
    status?: Status,
}

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
