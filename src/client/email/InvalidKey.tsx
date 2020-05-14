import React, {FC, useCallback, useState} from 'react';
import {successMessage, useResetPassword} from '../hooks/use-reset-password';
import {observer, useLocalStore} from 'mobx-react';
import {Button, Form} from 'semantic-ui-react';
import {onText} from '../hooks/use-form';
import {Stacktrace} from '../elements/Stacktrace';
import {isEmpty, isNil} from 'lodash';
import {Success} from '../elements/Success';
import {ButtonAsLink} from '../elements/ButtonAsLink';

export const InvalidKey: FC = observer(() => {

    const [opened, setOpened] = useState<boolean>(false);
    const form = useLocalStore<{ email: string }>(() => ({
        email: '',
    }));
    const open = useCallback(() => {
        setOpened(true);
    }, []);

    const {reset, loading, data, error} = useResetPassword(form.email);

    return (
        <>
            <p>Something went wrong, would you like to <ButtonAsLink onClick={open}>
                start over
            </ButtonAsLink>?</p>
            {opened && (
                <Form onSubmit={reset}>
                    <p>Enter your email below to reset password.</p>
                    <Form.Input
                        label={'Email'}
                        id={'email'}
                        type={'email'}
                        value={form.email}
                        onChange={onText(form, 'email')}
                        required
                    />
                    <Stacktrace error={error}/>
                    <Button
                        basic
                        fluid
                        primary
                        disabled={isEmpty(form.email) || loading}
                        loading={loading}
                    >Reset password</Button>
                    <Success message={successMessage} show={!isNil(data)}/>
                </Form>
            )}
        </>
    );
});
