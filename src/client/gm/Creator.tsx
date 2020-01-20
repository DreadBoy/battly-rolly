import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import {Splash} from '../common/Splash';
import {Message} from '../common/Message';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button, Grid, Icon, List} from 'semantic-ui-react';
import {Monster} from '../common/encounter';
import {MonsterParser} from './MonsterParser';
import {useDispatch} from 'react-redux';

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

    const remove = useCallback((monster: Monster) => () => {
        setMonsters(monsters.filter(m => m !== monster));
    }, [monsters]);

    const confirm = useCallback(() => {
        dispatch({
            type: 'START ENCOUNTER',
            payload: {
                monsters,
                phase: 0,
            },
        })
    }, [monsters, dispatch]);

    return (
        <Splash bg={bg} position={'88% center'}>
            <Message>Create encounter</Message>
            <Grid columns={2}>
                <Grid.Column>
                    <MonsterParser onParsed={onParsed}/>
                </Grid.Column>
                <Grid.Column>
                    <Message as={'h2'}>Overview</Message>
                    <List divided verticalAlign='middle'>
                        {monsters.map(monster => (
                            <List.Item key={Math.random().toString()}>
                                <List.Content floated='right'>
                                    <Icon link name={'remove'} onClick={remove(monster)}/>
                                </List.Content>
                                <List.Content verticalAlign={'middle'}>{monster.name}</List.Content>
                            </List.Item>
                        ))}
                    </List>
                    <Button primary disabled={monsters.length < 1} onClick={confirm}>Confirm encounter</Button>
                </Grid.Column>
            </Grid>
        </Splash>
    );
};
