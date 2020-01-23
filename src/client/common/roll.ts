import {Roll} from './encounter';

export function roll(roll: Roll) : number {
    return new Array(roll[0])
        .fill(0)
        .map(() => Math.floor(Math.random() * roll[1]) + 1)
        .reduce((a, c) => a + c, 0) + roll[2];
}
