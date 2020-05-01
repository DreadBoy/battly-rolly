import React, {FC, useCallback, useState} from 'react';
import {Button, Container, Form, Grid, Icon, Input} from 'semantic-ui-react';
import {observer, useLocalStore} from 'mobx-react';
import bg from '../../../assets/07cdffb028209e9b2fe3ef7fc142e920.jpg';
import {Message} from '../../common/Message';
import {Link} from 'react-router-dom';
import {Splash} from '../Splash';
import {onText} from '../hooks/use-form';
import {isEmpty} from 'lodash';
import {root} from '../v2';
import {Login as FormModel} from '../../../server/service/auth';
import {useBackend} from '../helpers/BackendProvider';
import {toJS} from 'mobx';
import {useLoader} from '../helpers/Store';
import {Stacktrace} from '../helpers/Stacktrace';
import {User} from '../../../server/model/user';

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
    const form = useLocalStore<FormModel>(() => ({
        email: '',
        password: '',
    }));

    const [passVisible, setPassVisible] = useState<boolean>(false);
    const togglePassVisible = useCallback(() => {
        setPassVisible(!passVisible)
    }, [passVisible]);

    const valid = !isEmpty(form.email) && !isEmpty(form.password);

    const loader = useLoader<OnLogin>();
    const loaderId = 'login';
    const login = useCallback(() => {
        loader.fetchAsync(api.put('/auth', toJS(form)), loaderId)
            .then(onLogin)
            .catch(e => e);
    }, [api, form, loader, onLogin]);

    return (
        <Splash bg={bg}>
            <Container>
                <Grid columns={2} centered doubling>
                    <Grid.Column>
                        <Message>Log In</Message>
                        <p>
                            Need a Battly Rolly account? <Link to={root('/register')}>Create an account</Link>
                        </p>
                        <Form onSubmit={login}>
                            <Form.Input
                                label={'Email'}
                                id={'email'}
                                type={'email'}
                                value={form.email}
                                onChange={onText(form, 'email')}
                                required
                            />
                            <Form.Field required>
                                <label htmlFor={'password'}>Password</label>
                                <Input
                                    id={'password'}
                                    type={passVisible ? 'text' : 'password'}
                                    icon={(
                                        <Icon
                                            link
                                            name={passVisible ? 'eye slash' : 'eye'}
                                            onClick={togglePassVisible}
                                        />
                                    )}
                                    value={form.password}
                                    onChange={onText(form, 'password')}
                                    required
                                >
                                </Input>
                            </Form.Field>
                            <Stacktrace error={loader.error[loaderId]}/>
                            <Button
                                basic
                                fluid
                                primary
                                disabled={!valid}
                                loading={loader.loading[loaderId]}
                            >Log In</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        </Splash>
    );
});
