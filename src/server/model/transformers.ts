import {abilities} from '../../client/v2/types/bestiary';
import {AbilitySet, Damage, DamageType, Roll} from './action';

export const Transformers = {
    boolean: {
        to: (input: boolean[]) => `[${input.join(',')}]`,
        from: (value: string) =>
            value.replace(/[[\]]/g, '').split(',').map((p: string) =>
                p === 'true' ? true : p === 'false' ? false : null),
    },
    number: {
        to: (input: number[]) => `[${input.join(',')}]`,
        from: (value: string) => value.replace(/[[\]]/g, '').split(',').map((p: string) => {
            const num = parseInt(p);
            return isNaN(num) ? null : num;
        }),
    },
    abilitySet: {
        to: (input: AbilitySet) => `[${abilities.map(ability => input[ability]).join(',')}]`,
        from: (value: string) => {
            const set = {} as AbilitySet;
            value
                .replace(/[[\]]/g, '').split(',')
                .map((p: string) => parseInt(p))
                .forEach((num, index) => {
                    set[abilities[index]] = num;
                });
            return set;
        },
    },
    damage: {
        to: (damage: Damage) => `[${damage.roll.join(',')}]:${damage.damageType}`,
        from: (value: string): Damage => {
            const [roll, type] = value.split(':')
            return {
                roll: roll
                    .replace(/[[\]]/g, '').split(',')
                    .map(p => parseInt(p)) as Roll,
                damageType: type as DamageType,
            };
        },
    },
}
