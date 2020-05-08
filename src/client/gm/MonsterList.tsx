import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import monsters from '../../assets/bestiary.json';
import {Dropdown, Form} from 'semantic-ui-react';
import {Monster} from '../../server/encounter';
import {DropdownProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import {find} from 'lodash';

type Props = {
    onAdd: (monster: Monster) => void,
}

const useStyles = createUseStyles({
    list: {
        marginBottom: '1em',
    },
});

export const MonsterList: FC<Props> = ({onAdd}) => {
    const classes = useStyles();
    const [value, setValue] = useState<string>('');

    const onClose = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const monster = find(monsters as Monster[], ['name', data.value]);
        if (monster) {
            onAdd(monster);
            setValue('')
        }
    }, [onAdd]);

    return (
        <Form className={classes.list}>
            <Form.Field>
                <Dropdown
                    placeholder={'Search monsters...'}
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
        </Form>
    );
};
