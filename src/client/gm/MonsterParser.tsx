import React, {FC, FormEventHandler, useCallback} from 'react';
import {Button, Form, TextArea} from 'semantic-ui-react';
import {useTextArea} from '../common/form-helpers';
import {findIndex} from 'lodash';
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
    Monster,
    Roll,
    Status,
    statuses,
} from '../common/encounter';

type Props = {
    onParsed: (monsters: Monster[]) => void,
};

export const MonsterParser: FC<Props> = ({onParsed}) => {
    const {value, onChange, setValue} = useTextArea('Aboleth 10 21 9 15 18 15 18 0 0 6 8 6 0 attack 9 2 6 5 bludgeoning 14 constitution stunned\nAboleth 10 21 9 15 18 15 18 0 0 6 8 6 0 attack 9 2 6 5 bludgeoning 14 constitution stunned\nAboleth 10 21 9 15 18 15 18 0 0 6 8 6 0 attack 9 2 6 5 bludgeoning 14 constitution stunned');
    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
        event.preventDefault();
        const monsters = value.split('\n').map(parseMonster);
        setValue('');
        onParsed(monsters);
    }, [onParsed, setValue, value]);

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <TextArea placeholder={'Import monsters...'} value={value} onChange={onChange}/>
            </Form.Field>
            <Button primary type={'submit'} disabled={value.length < 1}>Add monsters</Button>
        </Form>
    );
};

function parseMonster(str: string): Monster {
    const parts = str.split(' ');
    let index = 0;

    const name = parts[index++];
    const HP = parseInt(parts[index++]);
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
        name,
        HP,
        abilitySet,
        savingThrows,
        actions,
    };
}

function parseAttack(parts: string[]): Attack {
    let index = 0;
    const type = parts[index++] as 'attack';
    const modifier = parseInt(parts[index++]);
    const {damage, length: damageLength} = parseDamage(parts.slice(index));
    index += damageLength;
    const effect = parseEffect(parts.slice(index));
    return {
        type,
        modifier,
        damage,
        effect,
    }
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
