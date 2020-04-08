import monsters from '../../../assets/bestiary-v2.json';
import {find} from 'lodash';

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

export type Roll = [number, number, number];
export type Damage = {
    rolls: Roll[],
    damageType: DamageType,
}
export type ActionType = 'direct' | 'aoe';

export type BaseAction = {
    type: ActionType,
};

export type Direct = BaseAction & {
    type: 'direct',
    name: string,
    modifier: number,
    damage: Damage,
};

export function isDirect(action: Action): action is Direct {
    return action.type === 'direct';
}

export type AoE = BaseAction & {
    type: 'aoe',
    name: string,
} & Effect;

export function isAoe(action: Action): action is AoE {
    return action.type === 'aoe';
}

export type Action = BaseAction & (Direct | AoE)
export type Effect = {
    DC: number,
    ability: Ability,
    damageFailure?: Damage,
    damageSuccess?: Damage,
    status?: Status,
}
export type Monster = {
    name: string,
    HP: Roll,
    AC: number,
    abilitySet: AbilitySet,
    savingThrows: AbilitySet,
    actions: Action[],
}

export type AbilitySet = {
    strength: number,
    dexterity: number,
    constitution: number,
    intelligence: number,
    wisdom: number,
    charisma: number,
}

export function findMonster(name: string | undefined): Monster | undefined {
    return find(monsters, ['name', name]) as Monster;
}

export function findAction(monsterName: string | undefined, actionName: string | undefined): Action | undefined {
    return find(findMonster(monsterName)?.actions, ['name', actionName]);
}
