import bestiary from '../../assets/bestiary.json';
import {Monster} from '../common/encounter';
import {roll} from '../common/roll';
import {cloneDeep} from 'lodash';
import {generateId} from '../common/generate-id';

export function fakePlayer() {
    const id = Math.floor(Math.random() * 1000000).toString();
    return {
        type: 'CONNECT', payload: {
            id,
            data: {
                stats: {
                    name: `Player ${id}`,
                    AC: roll([1, 9, 9]),
                    passivePerception: roll([1, 4, 11]),
                },
            },
        },
    };
}

export function fakeMonster(HP: number = 1, id: string = generateId()): Monster {
    const ret = cloneDeep(bestiary[0]) as Monster;
    ret.maxHP = roll(ret.HP);
    ret.currentHP = ret.maxHP * HP;
    ret.id = id;
    return ret;
}
