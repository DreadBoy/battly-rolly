import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Card, List} from 'semantic-ui-react';
import {
    abilityShort,
    Action as DnDAction, isAttack, isAttackLog, isSave, isSaveLog,
    Monster,
    Player,
} from '../../../server/encounter';
import {Attack, nameToDisplay} from './Attack';
import classNames from 'classnames';
import {ManualAttack} from './ManualAttack';
import {Save} from './Save';

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
            <ManualAttack onAttack={onAttack}/>
            {monster.actions.map(action => isAttack(action) ? (
                <Attack key={Math.random()} action={action} onAttack={onAttack}/>
            ) : isSave(action) ? (
                <Save key={Math.random()} action={action} onAttack={onAttack}/>
            ) : null)}
            {monster.actionLog && !!monster.actionLog.length && (
                <Card.Content extra>
                    <List>
                        {monster.actionLog?.slice().reverse().map(log => (
                            <List.Item key={Math.random()}>
                                {isAttackLog(log) ? (
                                    <>
                                        <List.Content>{players[log.attackerId]?.stats?.name} ({nameToDisplay(log.attack.name)})
                                            -> {log.hitRoll}</List.Content>
                                        {log.success ? (
                                            <>
                                                <List.Icon name='exclamation' color={'red'}/>
                                                <List.Content>{log.damageRoll} ({log.attack.damage.damageType})</List.Content>
                                            </>
                                        ) : (
                                            <>
                                                <List.Icon name='checkmark' color={'green'}/>
                                                <List.Content>missed</List.Content>
                                            </>
                                        )}
                                    </>
                                ) : isSaveLog(log) ? (
                                    <List.Content>{players[log.attackerId]?.stats?.name} ({nameToDisplay(log.save.name)})
                                        -> {log.save.DC} {abilityShort(log.save.ability)}</List.Content>
                                ) : null}
                            </List.Item>
                        ))}
                    </List>
                </Card.Content>
            )}
        </Card>
    );
};
