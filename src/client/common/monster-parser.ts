import {useEffect} from 'react';
// @ts-ignore
import m2 from '../../assets/monsters.txt';
import {
    abilities,
    Ability,
    AbilitySet,
    Action,
    ActionType,
    actionTypes,
    Attack,
    Damage,
    DamageType,
    damageTypes,
    Effect,
    isAttack,
    Monster,
    Roll,
    Status,
    statuses,
} from './encounter';
import {findIndex} from 'lodash';

export function parseMonster(str: string): Monster {
    const parts = str.replace('\r', '').split(' ');
    let index = 0;

    const name = parts[index++];
    const HP = parts.slice(index++, index += 2).map(s => parseInt(s)) as Roll;
    const abilitySet: AbilitySet = {} as AbilitySet;
    abilities.forEach((ability, ind) => {
        abilitySet[ability] = parseInt(parts[index + ind])
    });
    index += 6;
    const savingThrows: AbilitySet = {} as AbilitySet;
    abilities.forEach((ability, ind) => {
        savingThrows[ability] = parseInt(parts[index + ind])
    });
    index += 6;
    const actions: Action[] = [];
    while (index < parts.length) {
        const type = parts[index] as ActionType;
        const nextIndex = findIndex(parts, part => actionTypes.includes(part), index + 1);
        switch (type) {
            case 'attack':
                const attack = parts.slice(index, nextIndex > 0 ? nextIndex : undefined);
                actions.push(parseAttack(attack));
        }
        index = nextIndex === -1 ? parts.length : nextIndex;
    }
    return {
        id: 0,
        name,
        HP,
        currentHP: 0,
        maxHP: 0,
        abilitySet,
        savingThrows,
        actions,
    };
}

export function exportMonster(monster: Monster) {
    return `${monster.name} ${monster.HP.join(' ')} ${
        abilities.map(a => monster.abilitySet[a]).join(' ')} ${
        abilities.map(a => monster.savingThrows[a]).join(' ')} ${
        monster.actions.map(action => isAttack(action) ? exportAttack(action) : undefined).filter(Boolean).join(' ')
    }`
}

function parseAttack(parts: string[]): Attack {
    let index = 0;
    const type = parts[index++] as 'attack';
    const name = parts[index++];
    const modifier = parseInt(parts[index++]);
    const {damage, length: damageLength} = parseDamage(parts.slice(index));
    index += damageLength;
    const effect = parseEffect(parts.slice(index));
    return {
        type,
        name,
        modifier,
        damage,
        effect,
    }
}

function exportAttack({type, name, modifier, damage, effect}: Attack) {
    let ret = `${type} ${name} ${modifier} ${exportDamage(damage)}`;
    if (!!effect)
        ret += ` ${exportEffect(effect)}`;
    return ret;
}

function parseDamage(parts: string[]): { damage: Damage, length: number } {
    const typeIndex = findIndex(parts, part => damageTypes.includes(part));
    const raw = parts
        .slice(0, typeIndex)
        .map(p => parseInt(p));
    const rolls: Roll[] = [];
    for (let i = 0; i < raw.length; i += 3)
        rolls.push([raw[i], raw[i + 1], raw[i + 2]]);
    return {damage: {rolls, damageType: parts[typeIndex] as DamageType}, length: typeIndex + 1};
}

function exportDamage({rolls, damageType}: Damage) {
    return `${rolls.map(exportRoll).join(' ')} ${damageType}`;
}

function parseEffect(parts: string[]): Effect | undefined {
    if (parts.length === 0)
        return undefined;
    let index = 0;
    const DC = parseInt(parts[index++]);
    const ability = parts[index++] as Ability;
    if (parts.length === 2)
        return {
            DC,
            ability,
        };
    if (parts.length === 3)
        return {
            DC,
            ability,
            status: parts[index++] as Status,
        };
    const statusIndex = findIndex(parts, part => statuses.includes(part), index);
    const {damage} = parseDamage(parts.slice(2, statusIndex + 1));
    return {
        DC,
        ability,
        damage,
        status: parts[statusIndex] as Status,
    };
}

function exportEffect(effect: Effect | undefined) {
    if (!effect)
        return '';
    const {DC, ability, status, damage} = effect;
    let ret = `${DC} ${ability}`;
    if (!!status && !damage)
        return `${ret} ${status}`;
    if (!!status && !!damage)
        return `${ret} ${exportDamage(damage)} ${status}`;
    return ret;
}

function exportRoll(roll: Roll) {
    return roll.join(' ');
}

export function useMonsterParser() {
    useEffect(() => {
        fetch(m2)
            .then((res) => res.text())
            .then((text) => text.split('\n').filter(line => !!line && !line.startsWith('#')))
            .then((lines) => lines.map(parseMonster))
            .then(m => console.log(JSON.stringify(m[0])));
    }, []);
}
