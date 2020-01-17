import React, {FC, FormEventHandler, useCallback} from 'react';
import {Button, Form, Header, Input} from 'semantic-ui-react';
import {useNumber} from '../common/form-helpers';
import bg from '../../assets/wp2227164.jpg';
import {Splash} from '../common/Splash';
import {useSocket} from '../common/Socket';

export const ConfirmStats: FC = () => {
    const {send} = useSocket();

    const {value: acString, number: ac, isValid, onChange: acOnChange} = useNumber();

    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
        event.preventDefault();
        send({
            type: 'SET STATS',
            payload: {
                ac,
            },
        });
    }, [ac, send]);
    return (
        <Splash bg={bg} position={'24% center'}>
            <Header as='h1'>Enter your stats</Header>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <Input label={'AC'} onChange={acOnChange} value={acString} error={!isValid || !ac || ac < 1}/>
                </Form.Field>
                <Button primary type={'submit'} disabled={!isValid || !ac || ac < 1}>Confirm</Button>
            </Form>
        </Splash>
    );
};
