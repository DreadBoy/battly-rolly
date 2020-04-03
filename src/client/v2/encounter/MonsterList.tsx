import React, {FC, useCallback, useState} from 'react';
import monsters from '../../../assets/bestiary-v2.json';
import {Dropdown, DropdownProps, Form} from 'semantic-ui-react';
import {find} from 'lodash';
import {Feature} from '../../../server/model/feature';
import {Monster} from '../types/bestiary';
import {roll} from '../../common/roll';

type Props = {
    onAdd: (features: Partial<Feature>[]) => void,
}

export const MonsterList: FC<Props> = ({onAdd}) => {
    // We intentionally don't set this value to anything other than empty string
    const [value, setValue] = useState<string>('');

    const onChange = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const monster = find(monsters, ['name', data.value]) as Monster;
        if (monster) {
            const HP = roll(monster.HP);
            const feature: Partial<Feature> = {
                type: 'npc',
                reference: monster.name,
                AC: monster.AC,
                HP,
                initialHP: HP,
            };
            onAdd([feature]);
            setValue('')
        }
    }, [onAdd]);

    return (
        <Form.Field>
            <label>Search monsters</label>
            <Dropdown
                search
                selection
                selectOnNavigation={false}
                options={monsters.map(m => ({
                    key: m.name, value: m.name, text: m.name,
                }))}
                value={value}
                onChange={onChange}
            />
        </Form.Field>
    );
};
