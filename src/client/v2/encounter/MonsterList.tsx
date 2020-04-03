import React, {FC, useCallback, useState} from 'react';
import monsters from '../../../assets/bestiary.json';
import {Dropdown, DropdownProps, Form} from 'semantic-ui-react';
import {find} from 'lodash';
import {Feature} from '../../../server/model/feature';
import {Monster} from '../types/bestiary';
import {roll} from '../../common/roll';

type Props = {
    onAdd: (features: Partial<Feature>[]) => void,
}

export const MonsterList: FC<Props> = ({onAdd}) => {
    const [value, setValue] = useState<string>('');

    const onClose = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const monster = find(monsters, ['name', data.value]) as unknown as Monster;
        if (monster) {
            const feature: Partial<Feature> = {
                type: 'npc',
                reference: monster.name,
                AC: monster.AC,
                HP: roll(monster.HP),
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
                options={monsters.map(m => ({
                    key: m.name, value: m.name, text: m.name,
                }))}
                onClose={onClose}
                value={value}
                onChange={(e, d) => setValue(d.value as string)}
            />
        </Form.Field>
    );
};