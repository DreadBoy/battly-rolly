import React, {FC} from 'react';
import {Card, List} from 'semantic-ui-react';
import {isAttackLog, isMissedAttackLog, Monster, Player} from '../../common/encounter';
import {useDrop} from 'react-dnd';
import {nameToDisplay} from './Action';

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
                                <List.Content>{monsters.find(m => m.id === log.attackerId)?.name} ({nameToDisplay(log.attackName)})
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
                </Card.Content>)}
            </Card>
        </div>
    );
};
