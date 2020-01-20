import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useEffect, useState} from 'react';
// @ts-ignore
import monstersSrc from '../../assets/Monster Manual Bestiary 2.6.0.xml';
import parser from 'fast-xml-parser'
import {Icon, Input, List} from 'semantic-ui-react';
import {useText} from '../common/form-helpers';
import {Monster} from '../common/encounter';
import {parseMonster} from './MonsterParser';

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
    const {value, onChange} = useText('Aboleth');
    const filter = value.toLowerCase();

    const [monsters, setMonsters] = useState<Monster[]>([]);

    useEffect(() => {
        fetch(monstersSrc)
            .then(res => res.text())
            .then(text => {
                const {compendium: {monster}} = parser.parse(text);
                setMonsters(monster);
            })
            .catch(() => undefined);
    }, []);

    const _monsters = monsters
        .filter(monster => monster.name?.toLowerCase().includes(filter));

    const add = useCallback((monster: any) => () => {
        onAdd(parseMonster('Aboleth 10 21 9 15 18 15 18 0 0 6 8 6 0 attack 9 2 6 5 bludgeoning 14 constitution stunned'));
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
