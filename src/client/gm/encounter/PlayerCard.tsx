import React, {FC} from 'react';
import {Card, List, Icon} from 'semantic-ui-react';
import {abilityShort, isAttackLog, isSaveLog, Monster, Player} from '../../common/encounter';
import {useDrop} from 'react-dnd';
import {nameToDisplay} from './Attack';

type Props = {
    playerId: string,
    player: Player,
    monsters: Monster[],
}

export const PlayerCard: FC<Props> = ({playerId, player, monsters}) => {
    const [{isOver}, drop] = useDrop({
        accept: 'monster',
        drop: () => ({playerId}),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    return (
        <div ref={drop}>
            <Card color={isOver ? 'red' : undefined}>
                <Card.Content>
                    <Card.Header>{player.stats?.name}</Card.Header>
                    <Card.Meta>
                        AC: {player.stats?.AC}
                    </Card.Meta>
                    <Card.Meta>
                        Pass. P: {player.stats?.passivePerception}
                    </Card.Meta>
                </Card.Content>
                {player.actionLog && !!player.actionLog.length && (<Card.Content extra>
                    <List>
                        {player.actionLog?.slice().reverse().map(log => (
                            <List.Item key={Math.random()}>
                                {isAttackLog(log) ? (
                                    <>
                                        <List.Content>{monsters.find(m => m.id === log.attackerId)?.name} ({nameToDisplay(log.attack.name)})
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
                                    <>
                                        <List.Content>{monsters.find(m => m.id === log.attackerId)?.name} ({nameToDisplay(log.save.name)})
                                            -> {log.save.DC} {abilityShort(log.save.ability)}</List.Content>
                                        {log.success !== null ? (
                                            <div>{log.success.toString()}</div>
                                        ) : (
                                            <List.Content>
                                                <Icon loading name='spinner' color={'blue'}/>
                                                waiting for results
                                            </List.Content>
                                        )}
                                    </>
                                ) : null}
                            </List.Item>
                        ))}
                    </List>
                </Card.Content>)}
            </Card>
        </div>
    );
};
