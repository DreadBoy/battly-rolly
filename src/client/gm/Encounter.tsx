import {createUseStyles} from 'react-jss';
import React, {FC, useCallback} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button, Form, Grid} from 'semantic-ui-react';
import {useDispatch, useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {Creator} from './Creator';
import {Message} from '../common/Message';
import {Action, AttackLog, isAttack, isSave, Monster, phases, SaveLog} from '../common/encounter';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend'
import {MonsterCard} from './encounter/MonsterCard';
import {PlayerCard} from './encounter/PlayerCard';
import {roll} from '../common/roll';
import {flatMap} from 'lodash';

const useStyles = createUseStyles({
    grid: {
        '.ui.grid+.grid&': {
            marginTop: 0,
        },
    },
    actions: {
        '.ui.form&': {
            marginTop: '1rem',
        },
    },
});

export const Encounter: FC = () => {
    const classes = useStyles();
    const encounter = useSelector((state: State) => state.encounter);
    const players = useSelector((state: State) => state.players);
    const dispatch = useDispatch();
    const phase = encounter?.phase || 0;


    const increasePhase = useCallback(() => {
        dispatch({type: 'SET PHASE', payload: (phase + 1) % 4});
    }, [dispatch, phase]);
    const hasQueue = flatMap(encounter?.monsters, m => m.actionLog).filter(Boolean).length > 0;
    const resolveQueue = useCallback(() => {
        dispatch({type: 'RESOLVE QUEUE'});
    }, [dispatch]);
    const finishEncounter = useCallback(() => {
        dispatch({type: 'FINISH ENCOUNTER'});
    }, [dispatch]);

    const attack = useCallback((monster: Monster) => (playerId: string, action: Action) => {
        if (isAttack(action)) {
            let log: AttackLog;

            const player = players[playerId].stats;
            const attackRoll = roll([1, 20, action.modifier]);
            if (attackRoll <= player.AC)
                log = {
                    attackerId: monster.id,
                    targetId: playerId,
                    attack: action,
                    hitRoll: attackRoll,
                    damageRoll: 0,
                    success: false,
                };
            else {
                const damage = action.damage.rolls.map(roll).reduce((a, c) => a + c, 0);
                log = {
                    attackerId: monster.id,
                    targetId: playerId,
                    attack: action,
                    hitRoll: attackRoll,
                    damageRoll: damage,
                    success: true,
                };
            }
            dispatch({
                type: 'ATTACK',
                payload: {playerId, log},
            });
        } else if (isSave(action)) {
            const log: SaveLog = {
                attackerId: monster.id,
                targetId: playerId,
                save: action,
                saveRoll: 0,
                success: null,
            };
            dispatch({
                type: 'ATTACK',
                payload: {playerId, log},
            })
        }
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
                            <MonsterCard monster={monster} onAttack={attack(monster)} players={players}/>
                        </Grid.Column>
                    ))}
                </Grid>
                {Object.keys(players).length > 0 && (
                    <Grid columns={'equal'} className={classes.grid}>
                        {Object.keys(players).map(id => (
                            <Grid.Column key={Math.random()}>
                                <PlayerCard playerId={id} player={players[id]} monsters={encounter?.monsters}/>
                            </Grid.Column>
                        ))}
                    </Grid>
                )}
            </DndProvider>
            <Form className={classes.actions}>
                <Form.Field equal>
                    {hasQueue && (<Button primary onClick={resolveQueue}>Resolve queue</Button>)}
                    <Button primary onClick={increasePhase}>Next phase</Button>
                </Form.Field>
                <Form.Field>
                    <Button onClick={finishEncounter}>Finish</Button>
                </Form.Field>
            </Form>
        </Splash>
    );
};
