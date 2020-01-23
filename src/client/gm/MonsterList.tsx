import {createUseStyles} from 'react-jss';
import React, {FC, useCallback} from 'react';
import monsters from '../../assets/bestiary.json';
import {Icon, Input, List} from 'semantic-ui-react';
import {useText} from '../common/form-helpers';
import {Monster} from '../common/encounter';

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
    const {value, onChange} = useText('');
    const filter = value.toLowerCase();

    const _monsters = monsters
        .filter(monster => monster.name?.toLowerCase().includes(filter)) as Monster[];

    const add = useCallback((monster: Monster) => () => {
        onAdd(monster);
    }, [onAdd]);

    return (
        <div className={classes.list}>
            <Input value={filter} onChange={onChange} placeholder={'Search monsters...'}/>
            {filter.length > 0 && (
                <List divided>
                    {_monsters.map(monster => (
                        <List.Item key={monster.name}>
                            <Icon link name='add' onClick={add(monster)}/>
                            <List.Content>
                                <List.Header>{monster.name}</List.Header>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    );
};
