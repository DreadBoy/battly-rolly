import React, {FC, FormEventHandler, useCallback} from 'react';
import {Button, Form, Header} from 'semantic-ui-react';
import {useNumber, useText} from '../common/form-helpers';
import bg from '../../assets/wp2227164.jpg';
import {Splash} from '../common/Splash';
import {useSocket} from '../common/Socket';
import {useLocalStorage} from '../common/use-local-storage';
import {useHistory} from 'react-router';
import {PlayerStats} from '../common/encounter';
import {SetStats} from '../common/actions';
import {usePlayerId} from './PlayerId';

function positive(useNumber: { isValid: boolean, number: number | undefined }) {
    return useNumber.isValid && useNumber.number && useNumber.number > 0;
}

export const ConfirmStats: FC = () => {
    const {send} = useSocket();
    const {push} = useHistory();
    const {value, set} = useLocalStorage('default stats');
    const stats: PlayerStats = value ? JSON.parse(value) : {};
    const AC = useNumber(stats?.AC?.toString() ?? '');
    const passivePerception = useNumber(stats?.passivePerception?.toString() ?? '');
    const name = useText(stats?.name?.toString() ?? '');
    const playerId = usePlayerId();

    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
        event.preventDefault();
        const stats = {
            name: name.value,
            AC: AC.number ?? 0,
            passivePerception: passivePerception.number ?? 0,
            playerId,
        };
        set(JSON.stringify(stats));
        send<SetStats>({
            type: 'SET STATS',
            payload: stats,
        });
        push('combat');
    }, [AC.number, name.value, passivePerception.number, playerId, push, send, set]);

    return (
        <Splash bg={bg} position={'24% center'}>
            <Header as='h1'>Enter your stats</Header>
            <Form onSubmit={onSubmit}>
                <Form.Input fluid label={'Name'} onChange={name.onChange} value={name.value} error={!name.value}/>
                <Form.Group widths='equal'>
                    <Form.Input fluid label={'AC'} onChange={AC.onChange} value={AC.value} error={!positive(AC)}/>
                    <Form.Input fluid label={'Passive perception'} onChange={passivePerception.onChange}
                                value={passivePerception.value} error={!positive(passivePerception)}/>
                </Form.Group>
                <Button primary type={'submit'}
                        disabled={!positive(AC) || !positive(passivePerception) || !name.value}>Confirm</Button>
            </Form>
        </Splash>
    );
};
