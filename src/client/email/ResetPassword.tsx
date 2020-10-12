import React, {FC, useEffect} from 'react';
import {Container, Grid, Header} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {useLocation} from 'react-router-dom';
import {Splash} from '../layout/Splash';
import {useBackend} from '../helpers/BackendProvider';
import {useLoader} from '../helpers/Store';
import {InvalidKey} from './InvalidKey';
import {PasswordForm} from './PasswordForm';

export const ResetPassword: FC = observer(() => {
    const {api} = useBackend();
    const {search} = useLocation();
    const key = (new URLSearchParams(search)).get('key') ?? '';

    const check = useLoader();
    useEffect(() => {
        check.fetch(api.post('/auth/reset-password', null, {params: {key}}), key);
    }, [api, check, key])

    return (
        <Splash>
            <Container>
                <Grid columns={2} centered doubling>
                    <Grid.Column>
                        <Header size={'huge'} textAlign='center'>Reset your password</Header>
                        {check.loading[key] ? (
                            <p>Checking your key...</p>
                        ) : check.error[key] ? (
                            <InvalidKey/>
                        ) : (
                            <PasswordForm query={key}/>
                        )}
                    </Grid.Column>
                </Grid>
            </Container>
        </Splash>
    );
});
