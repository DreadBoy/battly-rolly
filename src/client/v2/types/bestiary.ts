import {AbilitySet, Action, Roll} from '../../common/encounter';

export type Monster = {
    name: string,
    HP: Roll,
    AC: number,
    abilitySet: AbilitySet,
    savingThrows: AbilitySet,
    actions: Action[],
}
