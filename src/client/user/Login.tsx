import React, {FC, useCallback, useRef} from 'react';
import {Button, Container, Form, Grid, Header, Input, Icon} from 'semantic-ui-react';
import {observer, useLocalObservable} from 'mobx-react';
import {Link} from 'react-router-dom';
import {Splash} from '../layout/Splash';
import {onText} from '../hooks/use-form';
import {isEmpty, isNil} from 'lodash';
import {Login as FormModel} from '../../server/service/auth';
import {useBackend} from '../helpers/BackendProvider';
import {toJS} from 'mobx';
import {useLoader} from '../helpers/Store';
import {Stacktrace} from '../elements/Stacktrace';
import {User} from '../../server/model/user';
import {app} from '../App';
import {usePasswordInput} from '../hooks/use-password-input';
import {successMessage, useResetPassword} from '../hooks/use-reset-password';
import {Success} from '../elements/Success';
import {ButtonAsLink} from '../elements/ButtonAsLink';

type Props = {
    onLogin: (onLogin: OnLogin) => void,
};

export type OnLogin = {
    user: User,
    accessToken: string,
    refreshToken: string,
}

export const Login: FC<Props> = observer(({onLogin}) => {
    const {api} = useBackend();
    const form = useLocalObservable<FormModel>(() => ({
        email: '',
        password: '',
    }));

    const {type, icon} = usePasswordInput(form.password);

    const valid = !isEmpty(form.email) && !isEmpty(form.password);

    const loader = useLoader();
    const loaderId = 'login';
    const login = useCallback(() => {
        loader.fetchAsync(api.put('/auth', toJS(form)), loaderId)
            .then(onLogin)
            .catch(e => e);
    }, [api, form, loader, onLogin]);

    const inputRef = useRef<Input | null>(null);
    const {reset: _reset, loading, data, error} = useResetPassword(form.email);
    const reset = useCallback(() => {
        // @ts-ignore
        const input = inputRef.current?.inputRef?.current;
        if (isNil(input))
            return;
        if (!input.reportValidity())
            return;
        _reset();
    }, [_reset]);

    return (
        <Splash>
            <Container>
                <Grid columns={2} centered doubling>
                    <Grid.Column>
                        <Header size={'huge'} textAlign='center'>Log In</Header>
                        <p>
                            Need a Crit Hit account? <Link to={app('/register')}>Create an account</Link>
                        </p>
                        <Form onSubmit={login}>
                            <Form.Field required>
                                <label htmlFor={'email'}>Email</label>
                                <Input
                                    ref={inputRef}
                                    id={'email'}
                                    type={'email'}
                                    value={form.email}
                                    onChange={onText(form, 'email')}
                                    required
                                />
                            </Form.Field>
                            <Form.Field required>
                                <label htmlFor={'password'}>Password</label>
                                <Input
                                    id={'password'}
                                    type={type}
                                    icon={icon}
                                    value={form.password}
                                    onChange={onText(form, 'password')}
                                    required
                                >
                                </Input>
                            </Form.Field>
                            <p>
                                Forgot your password? <ButtonAsLink
                                onClick={reset}>Reset it</ButtonAsLink>
                                . {loading && <Icon name='spinner' color='blue' loading/>}
                            </p>
                            <Success message={successMessage} show={!isNil(data)}/>
                            <Stacktrace error={error}/>
                            <Stacktrace error={loader.error[loaderId]}/>
                            <Button
                                basic
                                fluid
                                primary
                                disabled={!valid || loader.loading[loaderId] || loading}
                                loading={loader.loading[loaderId]}
                            >Log In</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        </Splash>
    );
});
