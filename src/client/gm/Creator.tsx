import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import {Splash} from '../common/Splash';
import {Message} from '../common/Message';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button, Grid, Icon, List} from 'semantic-ui-react';
import {Monster} from '../common/encounter';
import {MonsterParser} from './MonsterParser';
import {useDispatch} from 'react-redux';
import {MonsterList} from './MonsterList';
import {cloneDeep} from 'lodash';
import {roll} from '../common/roll';
import {exportMonster} from '../common/monster-parser';
import {useSetupCombat} from './faker';


const useStyles = createUseStyles({
    creator: {},
});

export const Creator: FC = () => {
    useStyles();
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const dispatch = useDispatch();

    const onParsed = useCallback((_monsters: Monster[]) => {
        setMonsters([...monsters, ..._monsters]);
    }, [monsters]);
    const onAdd = useCallback((monster: Monster) => {
        setMonsters([...monsters, monster]);
    }, [monsters]);

    const remove = useCallback((monster: Monster) => () => {
        setMonsters(monsters.filter(m => m !== monster));
    }, [monsters]);

    const confirm = useCallback(() => {
        const _monsters = monsters.map(monster => {
            const m = cloneDeep(monster);
            m.currentHP = roll(m.HP);
            m.id = Math.random();
            return m;
        });
        dispatch({
            type: 'START ENCOUNTER',
            payload: {
                monsters: _monsters,
                phase: 0,
            },
        });
    }, [monsters, dispatch]);

    const exp = useCallback(() => {
        console.log(monsters.map(exportMonster).join('\n'));
    }, [monsters]);

    // TODO Remove this
    useSetupCombat(monsters, setMonsters, confirm, dispatch);

    return (
        <Splash bg={bg} position={'88% center'}>
            <Message>Create encounter</Message>
            <Grid columns={2}>
                <Grid.Column>
                    <MonsterList onAdd={onAdd}/>
                    <MonsterParser onParsed={onParsed}/>
                </Grid.Column>
                <Grid.Column>
                    <Message as={'h2'}>Overview</Message>
                    <List divided verticalAlign='middle'>
                        {monsters.map(monster => (
                            <List.Item key={Math.random().toString()}>
                                <Icon link name={'remove'} onClick={remove(monster)}/>
                                <List.Content>
                                    <List.Header>{monster.name}</List.Header>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
                    <div>
                        <Button primary disabled={monsters.length < 1} onClick={confirm}>Confirm encounter</Button>
                        <Button floated={'right'} disabled={monsters.length < 1} onClick={exp}>Export encounter</Button>
                    </div>
                </Grid.Column>
            </Grid>
        </Splash>
    );
};
