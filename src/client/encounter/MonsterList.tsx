import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Dropdown, DropdownProps, Form} from 'semantic-ui-react';
import {useLoader} from '../helpers/Store';
import {Monster} from '../../server/model/monster';
import {useBackend} from '../helpers/BackendProvider';
import {find, isEmpty, map, throttle} from 'lodash';
import {observer} from 'mobx-react';
import {roll} from '../common/roll';
import {Link} from 'react-router-dom';
import {sadFace} from '../common/emojis';
import {AddFeature} from '../../server/service/feature';

type Props = {
    onAdd: (features: AddFeature[]) => void,
}

export const MonsterList: FC<Props> = observer(({onAdd}) => {
    const {api} = useBackend();

    const [value, setValue] = useState<string>('');
    const loader = useLoader<Monster[]>()

    const fetch = useRef(
        throttle(
            (value: string) => loader.fetch(api.get(`/monster/search?search=${value}`), value),
            200,
            {leading: false},
        ),
    );

    useEffect(() => {
        if (isEmpty(value))
            return;
        fetch.current(value);
    }, [value]);

    const onSearchChange = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setValue(data.searchQuery ?? '');
    }, []);

    const onChange = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const monster = find(loader.data[value], ['id', data.value]);
        if (monster) {
            const HP = roll(monster.HP);
            const feature: AddFeature = {
                type: 'npc',
                reference: monster.id,
                AC: monster.AC,
                HP,
                initialHP: HP,
            };
            onAdd([feature]);
            setValue('')
        }
    }, [loader.data, onAdd, value]);

    return (
        <Form.Field>
            <label>Search monsters</label>
            <Dropdown
                search
                selection
                loading={loader.loading[value]}
                selectOnNavigation={false}
                options={map(loader.data[value], m => ({
                    key: m.id, value: m.id, text: m.name,
                }))}
                value={value}
                onSearchChange={onSearchChange}
                onChange={onChange}
                noResultsMessage={isEmpty(value) ?
                    'Start typing to search' :
                    loader.loading[value] ?
                        'Loading...' :
                        isEmpty(loader.data[value]) ? (
                            <Link to={`/v2/monster`}
                            >No monsters found. {sadFace} Create new by clicking here.</Link>
                        ) : null
                }
            />
        </Form.Field>
    );
});
