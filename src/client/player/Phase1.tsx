import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/rXi8wK.jpg';
import {Button, Card, Header} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {usePlayerId} from './PlayerId';
import {MonsterCard} from './encounter/MonsterCard';
import {filter, find, first, groupBy, size} from 'lodash';
import {isAttackLog, isSaveLog, SaveLog} from '../common/encounter';
import {useSocket} from '../common/Socket';
import {ConfirmLog, ResolveSave as ResolveSaveDispatch} from '../common/actions';
import {PhaseProps} from './encounter/phase';
import {coolFace, sadFace} from '../common/emojis';
import {ResolveSave} from './encounter/ResolveSave';

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

    const logs = groupBy(player?.actionLog, 'attackerId');
    const hasAttacks = size(filter(player?.actionLog, isAttackLog)) > 0;

    const hasHits = hasAttacks && size(filter(player?.actionLog, l => isAttackLog(l) && l.success)) > 0;

    const [confirmed, setConfirmed] = useState<boolean>(false);
    const confirm = useCallback(() => {
        send<ConfirmLog>({
            type: 'CONFIRM LOG',
            payload: {
                playerId,
            },
        });
        setConfirmed(true);
    }, [playerId, send]);
    useEffect(() => {
        if (hasHits && confirm)
            setConfirmed(false);
    }, [hasHits, confirm]);

    const hasSaves = size(filter(player?.actionLog, isSaveLog)) > 0;
    const firstSave = first(filter(player?.actionLog, isSaveLog)) as SaveLog;
    const resolve = useCallback((num: number) => {
        send<ResolveSaveDispatch>({
            type: 'RESOLVE SAVE',
            payload: {
                playerId,
                roll: num,
            },
        });
    }, [playerId, send]);

    return (
        <Splash bg={bg} position={`80% center`}>
            <Header className={classes.header} as={'h1'}>
                {phase} round
                {hasHits ? (
                    <Header.Subheader>
                        You are being attacked!
                    </Header.Subheader>
                ) : hasAttacks ? (
                    <Header.Subheader>
                        You are being attacked but all attacks missed! {coolFace}
                    </Header.Subheader>
                ) : confirmed ? (
                    <Header.Subheader>
                        Damage noted, get ready to attack back!
                    </Header.Subheader>
                ) : (
                    <Header.Subheader>
                        Nobody or nothing fancies you. Carry on...
                    </Header.Subheader>
                )}
            </Header>
            {hasHits && Object.keys(logs).map(monsterId => {
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
                                    <div key={Math.random()}>
                                        <span>{log.damageRoll} damage ({log.attack.damage.damageType})</span>
                                    </div>
                                ) : null)}
                        </Card.Content>
                    </MonsterCard>
                );
            })}
            {hasHits && (
                <Button primary onClick={confirm}>
                    Ok, noted! {sadFace}
                </Button>
            )}
            {hasSaves && (
                <ResolveSave save={firstSave} onResolve={resolve}/>
            )}
        </Splash>
    );
};
