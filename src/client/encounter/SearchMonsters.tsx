import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Dropdown, DropdownProps, Form} from 'semantic-ui-react';
import {useLoader} from '../helpers/Store';
import {Monster} from '../../server/model/monster';
import {useBackend} from '../helpers/BackendProvider';
import {find, isEmpty, map, throttle} from 'lodash';
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import {sadFace} from '../elements/emojis';

type Props = {
    onSelect: (monster: Monster) => void,
    pool?: 'available' | 'all',
}

export const SearchMonsters: FC<Props> = observer(({onSelect, pool}) => {
    const {api} = useBackend();

    const [value, setValue] = useState<string>('');
    const loader = useLoader<Monster[]>()

    const url = useRef<'search' | 'searchAll'>('search');
    useEffect(() => {
        if (pool === 'available')
            url.current = 'search';
        if (pool === 'all')
            url.current = 'searchAll';
    }, [pool])

    const fetch = useRef(
        throttle(
            (value: string) => loader.fetch(api.get(`/monster/${url.current}?search=${value}`), value),
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
            onSelect(monster);
            setValue('')
        }
    }, [loader.data, onSelect, value]);

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
SearchMonsters.defaultProps = {
    pool: 'available',
}
