import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {Splash} from '../../common/Splash';
import bg from '../../../assets/07cdffb028209e9b2fe3ef7fc142e920.jpg';
import {Redirect, useHistory, useRouteMatch} from 'react-router';
import {useSelector} from 'react-redux';
import {State} from '../../common/reducer';
import {Attack} from './Attack';
import {Button} from 'semantic-ui-react';
import {ActionLog, ActionType} from '../../common/encounter';
import {useSocket} from '../../common/Socket';
import {QueueAction} from '../../common/actions';
import {Save} from './Save';

const useStyles = createUseStyles({
    attackMonsters: {},
});

export const AttackMonsters: FC = () => {
    useStyles();
    const {location: {search}, replace, push} = useHistory();
    const {path, params} = useRouteMatch();
    const searchParams = new URLSearchParams(search);
    const ids = searchParams.get('monsters')?.split(',');
    const encounter = useSelector((state: State) => state.encounter);
    const monsters = (encounter?.monsters || []).filter(m => ids?.includes(m.id));
    const attackType = params.type as ActionType;

    const [result, setResult] = useState<ActionLog[]>([]);
    const [focused, setFocused] = useState<number>(0);
    const onFinish = useCallback((_result: ActionLog) => {
        setResult([...result, _result]);
        if (focused === monsters.length)
            return;
        setFocused(focused + 1)
    }, [focused, monsters.length, result]);

    const {send} = useSocket();

    const combatPath = `${path.slice(0, path.indexOf('/combat/'))}/combat`;

    const confirm = useCallback(() => {
        send<QueueAction>({
            type: 'QUEUE ACTION',
            payload: result,
        });
        push(combatPath);
    }, [send, result, push, combatPath]);

    useEffect(() => {
        if ((encounter?.phase ?? 1) % 2 !== 0)
            replace(combatPath);
    });

    if (monsters.length === 0)
        return <Redirect to={combatPath} push={false}/>;


    return (
        <Splash bg={bg}>
            {monsters?.map((monster, index) => attackType === 'attack' ? (
                <Attack
                    monster={monster}
                    key={monster.id}
                    focused={index === focused}
                    onFinish={onFinish}
                />
            ) : (
                <Save
                    monster={monster}
                    key={monster.id}
                    focused={index === focused}
                    onFinish={onFinish}
                />
            ))}
            {focused === monsters.length && (
                <Button primary onClick={confirm}>Confirm</Button>
            )}
        </Splash>
    );
};
