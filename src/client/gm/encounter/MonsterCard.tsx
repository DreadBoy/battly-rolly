import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Card, List} from 'semantic-ui-react';
import {Action as DnDAction, isAttack, isAttackLog, isMissedAttackLog, Monster, Player} from '../../common/encounter';
import {Action, nameToDisplay} from './Action';
import classNames from 'classnames';
import {ManualAction} from './ManualAction';

type Props = {
    monster: Monster,
    onAttack: (playerId: string, action: DnDAction) => void,
    players: {
        [id: string]: Player
    },
};

const useStyles = createUseStyles({
    monsterCard: {
        cursor: 'pointer',
    },
    dead: {
        '.ui.card&': {
            background: 'grey',
        },
    },
});

export const MonsterCard: FC<Props> = ({monster, onAttack, players}) => {
    const classes = useStyles();

    return (
        <Card className={classNames(classes.monsterCard, {[classes.dead]: monster.currentHP <= 0})}>
            <Card.Content>
                <Card.Header>{monster.name}</Card.Header>
                <Card.Meta>
                    <span>HP: {monster.currentHP} / {monster.maxHP} - {(monster.currentHP / monster.maxHP * 100).toFixed(2)}%</span>
                </Card.Meta>
            </Card.Content>
            <ManualAction onAttack={onAttack}/>
            {monster.actions.map(action => isAttack(action) ? (
                <Action key={Math.random()} action={action} onAttack={onAttack}/>
            ) : null)}
            {monster.actionLog && !!monster.actionLog.length && (
                <Card.Content extra>
                    <List>
                        {monster.actionLog?.slice().reverse().map(log => (
                            <List.Item key={Math.random()}>
                                <List.Content>{players[log.attackerId]?.stats?.name} ({nameToDisplay(log.attackName)})
                                    -> {log.attackRoll}</List.Content>
                                {isMissedAttackLog(log) && (
                                    <>
                                        <List.Icon name='checkmark' color={'green'}/>
                                        <List.Content>missed</List.Content>
                                    </>
                                )}
                                {isAttackLog(log) && (
                                    <>
                                        <List.Icon name='exclamation' color={'red'}/>
                                        <List.Content>{log.damage} ({log.damageType})</List.Content>
                                    </>
                                )}
                            </List.Item>
                        ))}
                    </List>
                </Card.Content>
            )}
        </Card>
    );
};
