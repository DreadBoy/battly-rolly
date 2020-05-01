import React, {FC, useCallback, useState} from 'react';
import {Button, Container, Form, Grid, Icon, Input, Progress, SemanticCOLORS} from 'semantic-ui-react';
import {observer, useLocalStore} from 'mobx-react';
import bg from '../../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Message} from '../../common/Message';
import {Link, useHistory} from 'react-router-dom';
import {Splash} from '../Splash';
import {onText} from '../hooks/use-form';
import {PasswordMeter} from 'password-meter';
import {isEmpty} from 'lodash';
import {root} from '../v2';
import {Register as FormModel} from '../../../server/service/auth';
import {useLoader} from '../helpers/Store';
import {toJS} from 'mobx';
import {useBackend} from '../helpers/BackendProvider';
import {Stacktrace} from '../helpers/Stacktrace';
import {useLocalStorage} from '../../common/use-local-storage';
import {OnLogin} from './Login';

const strengthToColour: { [strength: string]: SemanticCOLORS } = {
    veryWeak: 'red',
    weak: 'red',
    medium: 'orange',
    strong: 'yellow',
    veryStrong: 'olive',
    perfect: 'green',
}

export const Register: FC = observer(() => {
    const {api} = useBackend();
    const {push} = useHistory();
    const {set} = useLocalStorage('player');

    const form = useLocalStore<FormModel>(() => ({
        email: '',
        displayName: '',
        password: '',
    }));
    const passwordStrength = new PasswordMeter().getResult(form.password);

    const [passVisible, setPassVisible] = useState<boolean>(false);
    const togglePassVisible = useCallback(() => {
        setPassVisible(!passVisible)
    }, [passVisible]);

    const valid = !isEmpty(form.email) && !isEmpty(form.displayName) && !isEmpty(form.password);

    const loader = useLoader<OnLogin>();
    const loaderId = 'login';
    const register = useCallback(() => {
        loader.fetchAsync(api.post('/auth', toJS(form)), loaderId)
            .then(data => {
                set(JSON.stringify(data));
                push(root('/campaign'));
            })
            .catch(e => e)
        ;
    }, [api, form, loader, push, set]);

    return (
        <Splash bg={bg} position={'88% center'}>
            <Container>
                <Grid columns={2} centered doubling>
                    <Grid.Column>
                        <Message>Welcome to Battly Rolly</Message>
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
                                {passwordStrength.status !== 'Empty' && (
                                    <Progress
                                        percent={passwordStrength.percent}
                                        attached={'bottom'}
                                        color={strengthToColour[passwordStrength.status]}/>
                                )}
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
