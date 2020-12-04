import React, {FC, useCallback} from 'react';
import {Button, Container, Form, Grid, Input} from 'semantic-ui-react';
import {observer, useLocalObservable} from 'mobx-react';
import {Link, useHistory} from 'react-router-dom';
import {Splash} from '../layout/Splash';
import {onText} from '../hooks/use-form';
import {isEmpty} from 'lodash';
import {Register as FormModel} from '../../server/service/auth';
import {useLoader} from '../helpers/Store';
import {toJS} from 'mobx';
import {useBackend} from '../helpers/BackendProvider';
import {Stacktrace} from '../elements/Stacktrace';
import {usePlayerId} from '../helpers/PlayerId';
import {app} from '../App';
import {usePasswordInput} from '../hooks/use-password-input';
import {FormLogo} from './FormLogo';

export const Register: FC = observer(() => {
    const {api} = useBackend();
    const {push} = useHistory();
    const {onLogin} = usePlayerId();

    const form = useLocalObservable<FormModel>(() => ({
        email: '',
        displayName: '',
        password: '',
    }));

    const {type, icon, meter} = usePasswordInput(form.password);

    const valid = !isEmpty(form.email) && !isEmpty(form.displayName) && !isEmpty(form.password);

    const loader = useLoader();
    const loaderId = 'login';
    const register = useCallback(() => {
        loader.fetchAsync(api.post('/auth', toJS(form)), loaderId)
            .then(data => {
                onLogin(data);
                push(app('/campaign'));
            })
            .catch(e => e)
        ;
    }, [api, form, loader, onLogin, push]);

    return (
        <Splash>
            <Container>
                <Grid columns={2} centered doubling>
                    <Grid.Column>
                        <FormLogo>Welcome to Crit Hit</FormLogo>
                        <p>
                            Run encounters with ease. Create custom monsters. Do it all with Crit Hit.
                            Already have an account? <Link to={app()}>Log in</Link>
                        </p>
                        <Form onSubmit={register}>
                            <Form.Input
                                label={'Email'}
                                id={'email'}
                                type={'email'}
                                value={form.email}
                                onChange={onText(form, 'email')}
                                required
                            />
                            <Form.Input
                                label={'Display name'}
                                id={'display_name'}
                                value={form.displayName}
                                onChange={onText(form, 'displayName')}
                                required
                            />
                            <Form.Field>
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
                                {meter}
                            </Form.Field>
                            <Stacktrace error={loader.error[loaderId]}/>
                            <Button
                                basic
                                fluid
                                primary
                                disabled={!valid}
                                loading={loader.loading[loaderId]}
                            >Sign up</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        </Splash>
    );
});
