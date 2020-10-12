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
    damageSuccessRoll: number,
    damageFailureRoll: number,
    saveRoll: number,
    success: boolean | null,
}

export function isSaveLog(log: ActionLog): log is SaveLog {
    return typeof (log as SaveLog).save !== 'undefined';
}

export const damageTypes = ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'] as const;
export type DamageType = typeof damageTypes[number];

export const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;
export type Ability = typeof abilities[number];

export const statuses = ['blinded', 'charmed', 'deafened', 'fatigued', 'frightened', 'grappled', 'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned', 'unconscious', 'exhaustion'] as const;
export type Status = typeof statuses[number];

export type Roll = [number, number, number];
export type Damage = {
    rolls: Roll[],
    damageType: DamageType,
}
export const actionTypes = ['attack', 'save'] as const;
export type ActionType = typeof actionTypes[number];

export type BaseAction = {
    type: ActionType,
};

export type Attack = BaseAction & {
    type: 'attack',
    name: string,
    modifier: number,
    damage: Damage,
};

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
    // this means whether AoE attack hits
    damageSuccess?: Damage,
    // this means whether AoE attack misses
    damageFailure?: Damage,
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
