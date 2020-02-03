import {createUseStyles} from 'react-jss';
import React, {FC, useCallback} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/rXi8wK.jpg';
import {Button, Card, Header} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {usePlayerId} from './PlayerId';
import {MonsterCard} from './encounter/MonsterCard';
import {find, groupBy} from 'lodash';
import {isAttackLog} from '../common/encounter';
import {useSocket} from '../common/Socket';
import {ConfirmLog} from '../common/actions';
import {PhaseProps} from './encounter/phase';

const useStyles = createUseStyles({
    header: {
        textAlign: 'center',
    },
});

export const Phase1: FC<PhaseProps> = ({phase}) => {
    const classes = useStyles();
    const playerId = usePlayerId();
    const player = useSelector((state: State) => state.players[playerId]);
    const encounter = useSelector((state: State) => state.encounter);
    const {send} = useSocket();

    const getMonster = useCallback((monsterId: string) => {
        return find(encounter?.monsters, ['id', monsterId]);
    }, [encounter]);

    const logs = groupBy(player.actionLog, 'attackerId');
    const hasLogs = player.actionLog && player.actionLog.length > 0;
    const confirm = useCallback(() => {
        send<ConfirmLog>({
            type: 'CONFIRM LOG',
            payload: {
                playerId,
            },
        })
    }, [playerId, send]);

    return (
        <Splash bg={bg} position={`80% center`}>
            <Header className={classes.header} as={'h1'}>
                {phase} round
                {hasLogs ? (
                    <Header.Subheader>
                        You are being attacked!
                    </Header.Subheader>
                ) : (
                    <Header.Subheader>
                        Nobody or nothing fancies you. Carry on...
                    </Header.Subheader>
                )}
            </Header>
            {Object.keys(logs).map(monsterId => {
                const monster = getMonster(monsterId);
                const list = logs[monsterId];
                if (!monster)
                    return null;
                return (
                    <MonsterCard monster={monster} key={monster.id}>
                        <Card.Content extra>
                            {list
                                ?.filter(log => isAttackLog(log))
                                .reverse()
                                .map(log => isAttackLog(log) ? (
                                    <div>
                                        <span>{log.damage} damage ({log.damageType})</span>
                                    </div>
                                ) : null)}
                        </Card.Content>
                    </MonsterCard>
                );
            })}
            {hasLogs && (
                <Button primary onClick={confirm}>
                    Ok, noted! 😥
                </Button>
            )}
        </Splash>
    );
};
