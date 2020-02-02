import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import {Splash} from '../../common/Splash';
import bg from '../../../assets/07cdffb028209e9b2fe3ef7fc142e920.jpg';
import {useHistory} from 'react-router';
import {useSelector} from 'react-redux';
import {State} from '../../common/reducer';
import {Attack} from './Attack';
import {Button} from 'semantic-ui-react';
import {ActionLog} from '../../common/encounter';
import {useSocket} from '../../common/Socket';
import {QueueAction} from '../../common/actions';

const useStyles = createUseStyles({
    attackMonsters: {},
});

export const AttackMonsters: FC = () => {
    useStyles();
    const {location: {search}} = useHistory();
    const params = new URLSearchParams(search);
    const ids = params.get('monsters')?.split(',').map(id => parseFloat(id));
    const encounter = useSelector((state: State) => state.encounter);
    const monsters = (encounter?.monsters || []).filter(m => ids?.includes(m.id));

    const [result, setResult] = useState<ActionLog[]>([]);
    const [focused, setFocused] = useState<number>(0);
    const onFinish = useCallback((_result: ActionLog) => {
        setResult([...result, _result]);
        if (focused === monsters.length)
            return;
        setFocused(focused + 1)
    }, [focused, monsters.length, result]);

    const {send} = useSocket();
    const confirm = useCallback(() => {
        send<QueueAction>({
            type: 'QUEUE ACTION',
            payload: result,
        });
    }, [send, result]);

    return (
        <Splash bg={bg}>
            {monsters?.map((monster, index) => (
                <Attack monster={monster} key={monster.id} focused={index === focused} onFinish={onFinish}/>
            ))}
            {focused === monsters.length && (
                <Button primary onClick={confirm}>Confirm</Button>
            )}
        </Splash>
    );
};