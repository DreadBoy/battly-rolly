import {Roll} from './encounter';
import {map, sum, times, isNil} from 'lodash';

export function roll(roll: Roll): number {
    return sum(
        times(
            roll[0],
            () => Math.floor(Math.random() * roll[1]) + 1,
        ),
    ) + roll[2];
}

export function rollMulti(rolls: Roll[] | undefined): number {
    if (isNil(rolls))
        return 0;
    return sum(map(rolls, roll));
}
