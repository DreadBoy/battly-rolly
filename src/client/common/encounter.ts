export type Phase = 0 | 1 | 2 | 3;
export const phases = ['Fast player', 'Fast monster', 'Slow player', 'Slow monster'];
export type PlayerStats = {
    AC: number,
    passivePerception: number,
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
export const damageTypes = ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'];
export type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
export const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;
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
export const statuses = ['blinded', 'charmed', 'deafened', 'fatigued', 'frightened', 'grappled', 'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned', 'unconscious', 'exhaustion'];
export type Roll = [number, number, number];
export type Damage = {
    rolls?: Roll[],
    damageType?: DamageType,
}
export type ActionType = 'attack' | 'save' | 'guarantied';
export const actionTypes = ['attack', 'save', 'guarantied'];

export type Attack = {
    type: 'attack',
    modifier: number,
    damage: Damage,
    effect?: Effect,
};

export type Action = {
    type: ActionType,
} | Attack | (
    { type: 'save' } & Effect
    ) | {
    type: 'guarantied',
    damage?: Damage,
    effect?: Effect,
}
export type Effect = {
    DC: number,
    ability: Ability,
    damage?: Damage,
    status?: Status,
}
export type Monster = {
    name: string,
    HP: number,
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
export type Encounter = {
    monsters: Monster[],
    phase: Phase,
}
