import {Roll} from './encounter';
import {sum} from 'lodash';

export function roll(roll: Roll): number {
    return sum(
        new Array(roll[0])
            .fill(0)
            .map(() => Math.floor(Math.random() * roll[1]) + 1),
    ) + roll[2];
}

export function rollMultiple(rolls: Roll[]): number {
    return sum(rolls.map(roll));
}
