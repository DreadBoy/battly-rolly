export type Phase = 0 | 1 | 2 | 3;
export const phases = ['Fast player', 'Fast monster', 'Slow player', 'Slow monster'];
export type PlayerStats = {
    name: string,
    AC: number,
    passivePerception: number,
}
export type Player = {
    stats: PlayerStats,
    actionLog: ActionLog[],
}

export type ActionLog = {
    attackerId: string,
    targetId: string,
}

export type AttackLog = ActionLog & {
    attack: Attack,
    hitRoll: number,
    damageRoll: number,
    success: boolean,
}

export function isAttackLog(log: ActionLog): log is AttackLog {
    return typeof (log as AttackLog).attack !== 'undefined';
}

export type SaveLog = ActionLog & {
    save: Save,
    saveRoll: number,
    success: boolean | null,
}

export function isSaveLog(log: ActionLog): log is SaveLog {
    return typeof (log as SaveLog).save !== 'undefined';
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
    rolls: Roll[],
    damageType: DamageType,
}
export type ActionType = 'attack' | 'save';
export const actionTypes = ['attack', 'save'];

export type BaseAction = {
    type: ActionType,
};

export type Attack = BaseAction & {
    type: 'attack',
    name: string,
    modifier: number,
    damage: Damage,
};

export function isAttack(action: Action): action is Attack {
    return action.type === 'attack';
}

export type Save = BaseAction & {
    type: 'save',
    name: string,
} & Effect;

export function isSave(action: Action): action is Save {
    return action.type === 'save';
}

export type Action = BaseAction & (Attack | Save)
export type Effect = {
    DC: number,
    ability: Ability,
    damageFailure?: Damage,
    damageSuccess?: Damage,
    status?: Status,
}

export function abilityShort(ability: Ability) {
    return ability.slice(0, 3);
}

export type Monster = {
    id: string,
    name: string,
    HP: Roll,
    currentHP: number,
    maxHP: number,
    AC: number,
    abilitySet: AbilitySet,
    savingThrows: AbilitySet,
    actions: Action[],
    actionLog?: ActionLog[],
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
