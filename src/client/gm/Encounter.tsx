import {createUseStyles} from 'react-jss';
import React, {FC, useCallback} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button, Grid} from 'semantic-ui-react';
import {useDispatch, useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {Creator} from './Creator';
import {Message} from '../common/Message';
import {Action, AttackLog, isAttack, MissedAttackLog, Monster, phases} from '../common/encounter';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend'
import {MonsterCard} from './encounter/MonsterCard';
import {PlayerCard} from './encounter/PlayerCard';
import {roll} from '../common/roll';

const useStyles = createUseStyles({
    combat: {},
});

export const Encounter: FC = () => {
    useStyles();
    const encounter = useSelector((state: State) => state.encounter);
    const players = useSelector((state: State) => state.players);
    const dispatch = useDispatch();
    const phase = encounter?.phase || 0;
    const increasePhase = useCallback(() => {
        dispatch({type: 'SET PHASE', payload: (phase + 1) % 4});
    }, [dispatch, phase]);

    const attack = useCallback((monster: Monster) => (playerId: string, action: Action) => {
        if (!isAttack(action))
            return;
        let log: AttackLog | MissedAttackLog;

        const player = players[playerId].stats;
        const attackRoll = roll([1, 20, action.modifier]);
        if (attackRoll <= player.AC) {
            alert('Attack missed!');
            log = {
                monsterId: monster.id,
                attackRoll,
                attackName: action.name,
            };
        } else {
            const damage = action.damage.rolls.map(roll).reduce((a, c) => a + c, 0);
            alert(`${playerId} took ${damage} ${action.damage.damageType} damage`);
            log = {
                monsterId: monster.id,
                attackRoll,
                attackName: action.name,
                damage,
                damageType: action.damage.damageType,
            };
        }
        dispatch({
            type: 'ATTACK',
            payload: {playerId, log},
        })
    }, [dispatch, players]);

    if (!encounter)
        return <Creator/>;
    return (
        <Splash bg={bg} position={'88% center'} centered>
            <Message>Encounter in {phases[phase]} phase</Message>
            <DndProvider backend={Backend}>
                <Grid columns={'equal'}>
                    {encounter.monsters.map(monster => (
                        <Grid.Column key={Math.random()}>
                            <MonsterCard monster={monster} onAttack={attack(monster)}/>
                        </Grid.Column>
                    ))}
                </Grid>
                <Grid columns={'equal'}>
                    {Object.keys(players).map(id => (
                        <Grid.Column key={Math.random()}>
                            <PlayerCard playerId={id} player={players[id]} monsters={encounter?.monsters}/>
                        </Grid.Column>
                    ))}
                </Grid>
            </DndProvider>
            <Button onClick={increasePhase}>Next phase</Button>
        </Splash>
    );
};
