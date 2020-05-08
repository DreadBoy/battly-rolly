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
import {isAttackLog, isSaveLog, SaveLog} from '../../server/encounter';
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

    const hasAttacksThatHit = hasAttacks && size(filter(player?.actionLog, l => isAttackLog(l) && l.success)) > 0;

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
        if (hasAttacksThatHit && confirm)
            setConfirmed(false);
    }, [hasAttacksThatHit, confirm]);

    const hasUnresolvedSaves = size(filter(player?.actionLog, l => isSaveLog(l) && l.success === null)) > 0;
    const firstUnresolvedSave = first(filter(player?.actionLog, l => isSaveLog(l) && l.success === null)) as SaveLog;

    const savesThatHit = [...filter(player?.actionLog, l => isSaveLog(l) && l.success === true),
        ...filter(player?.actionLog, l => isSaveLog(l) && l.success === false && !!l.save.damageFailure)];
    const savesThatMissed = filter(player?.actionLog, l => isSaveLog(l) && l.success === false && !l.save.damageFailure);
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
                {hasAttacksThatHit || size(savesThatHit) > 0 ? (
                    <Header.Subheader>
                        You are being attacked!
                    </Header.Subheader>
                ) : hasAttacks || size(savesThatMissed) > 0 ? (
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
            {(hasAttacksThatHit || size(savesThatHit) > 0) && Object.keys(logs).map(monsterId => {
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
                            {list
                                ?.filter(log => isSaveLog(log) && log.success != null)
                                .reverse()
                                .map(log => isSaveLog(log) && log.success ? (
                                    <div key={Math.random()}>
                                        <span>{log.damageSuccessRoll} damage ({log.save.damageSuccess?.damageType})</span>
                                    </div>
                                ) : isSaveLog(log) && !log.success ? (
                                    <div key={Math.random()}>
                                        <span>{log.damageFailureRoll} damage ({log.save.damageFailure?.damageType})</span>
                                    </div>
                                ) : null)}
                        </Card.Content>
                    </MonsterCard>
                );
            })}
            {hasAttacksThatHit && (
                <Button primary onClick={confirm}>
                    Ok, noted! {sadFace}
                </Button>
            )}
            {hasUnresolvedSaves && (
                <ResolveSave save={firstUnresolvedSave} onResolve={resolve}/>
            )}
        </Splash>
    );
};
