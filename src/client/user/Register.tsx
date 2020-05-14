import React, {FC, useCallback} from 'react';
import {Button, Container, Form, Grid, Header, Input} from 'semantic-ui-react';
import {observer, useLocalStore} from 'mobx-react';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
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
import {OnLogin} from './Login';
import {root} from '../App';
import {usePasswordInput} from '../hooks/use-password-input';

export const Register: FC = observer(() => {
    const {api} = useBackend();
    const {push} = useHistory();
    const {onLogin} = usePlayerId();

    const form = useLocalStore<FormModel>(() => ({
        email: '',
        displayName: '',
        password: '',
    }));

    const {type, icon, meter} = usePasswordInput(form.password);

    const valid = !isEmpty(form.email) && !isEmpty(form.displayName) && !isEmpty(form.password);

    const loader = useLoader<OnLogin>();
    const loaderId = 'login';
    const register = useCallback(() => {
        loader.fetchAsync(api.post('/auth', toJS(form)), loaderId)
            .then(data => {
                onLogin(data);
                push(root('/campaign'));
            })
            .catch(e => e)
        ;
    }, [api, form, loader, onLogin, push]);

    return (
        <Splash bg={bg} position={'88% center'}>
            <Container>
                <Grid columns={2} centered doubling>
                    <Grid.Column>
                        <Header size={'huge'} textAlign='center'>Welcome to Battly Rolly</Header>
                        <p>
                            Run encounters. Create custom monsters. Do it all with Battly Rolly.
                            Already have an account? <Link to={root()}>Log in</Link>
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
