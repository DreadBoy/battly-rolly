import {useEffect} from 'react';
import m from '../../assets/bestiary.json';
import {Monster} from '../common/encounter';
import {roll} from '../common/roll';
import bestiary from '../../assets/bestiary.json';
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

export function fakeMonster(HP: number = 1): Monster {
    const ret = cloneDeep(bestiary[0]) as Monster;
    ret.maxHP = roll(ret.HP);
    ret.currentHP = ret.maxHP * HP;
    ret.id = generateId();
    return ret;
}

export function useSetupCombat(monsters: Monster[], setMonsters: Function, confirm: Function, dispatch: Function) {
    useEffect(() => {
        const _m = new Array(4).fill(m[0] as Monster);
        if (monsters.length === 0) {
            setMonsters(_m);
            dispatch(fakePlayer());
            dispatch(fakePlayer());
            dispatch(fakePlayer());
            dispatch(fakePlayer());
        } else
            confirm();
    }, [confirm, dispatch, monsters, setMonsters]);
}
