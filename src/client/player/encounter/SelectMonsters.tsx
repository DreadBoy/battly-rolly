import React, {FC, useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {State} from '../../common/reducer';
import {Button, Form, Grid} from 'semantic-ui-react';
import {Select} from './Select';
import {createUseStyles} from 'react-jss';
import {ActionType, Monster} from '../../../server/encounter';
import {useHistory} from 'react-router';


const useStyles = createUseStyles({
    grid: {
        '.ui.grid&': {
            marginTop: '-1rem',
            marginBottom: 0,
            marginLeft: '-0.5rem',
            marginRight: '-0.5rem',
        },
    },
    column: {
        '.ui.grid>.column:not(.row)&':
            {
                padding: '0.5rem',
            },
    },
});

export const SelectMonsters: FC = () => {
    const classes = useStyles();
    const encounter = useSelector((state: State) => state.encounter);
    const {push} = useHistory();

    const [selected, setSelected] = useState<string[]>([]);
    const [type, setType] = useState<ActionType>('attack');

    const toggle = useCallback((monster: Monster) => () => {
        if (selected.find(id => id === monster.id))
            setSelected(selected.filter(s => s !== monster.id));
        else if (type === 'save')
            setSelected([...selected, monster.id]);
        else if (type === 'attack')
            setSelected([monster.id]);
    }, [selected, type]);

    const onChangeType = useCallback((t: ActionType) => () => {
        setType(t);
        setSelected([]);
    }, []);

    const onSubmit = useCallback(() => {
        push(`combat/${type}?monsters=${selected.join(',')}`)
    }, [push, selected, type]);

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group inline>
                <Form.Radio
                    label='Attack'
                    value='attack'
                    checked={type === 'attack'}
                    onChange={onChangeType('attack')}
                />
                <Form.Radio
                    label='Save'
                    value='save'
                    checked={type === 'save'}
                    onChange={onChangeType('save')}
                />
            </Form.Group>
            <Grid className={classes.grid}>
                {encounter?.monsters.map(monster => (
                    <Grid.Column width={8} className={classes.column} key={monster.id}>
                        <Select
                            monster={monster}
                            onClick={toggle(monster)}
                            selected={selected.includes(monster.id)}
                        />
                    </Grid.Column>
                ))}
            </Grid>
            <Button primary type={'submit'} disabled={selected.length < 1}>Attack!</Button>
        </Form>
    );
};
