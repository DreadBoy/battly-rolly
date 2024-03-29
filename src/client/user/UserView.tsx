import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {observer} from 'mobx-react';
import {useGlobalStore} from '../helpers/GlobalStore';
import {User} from '../../server/model/user';
import {useRouteMatch} from 'react-router';
import {fakeRequest, useBackend} from '../helpers/BackendProvider';
import {SilentShareMessage, useShare} from '../hooks/use-share';
import {possessive} from '../helpers/display-helpers';
import {AsyncSection} from '../helpers/AsyncSection';
import {Stacktrace} from '../elements/Stacktrace';
import {Success} from '../elements/Success';
import {isNil} from 'lodash';
import {successMessage, useResetPassword} from '../hooks/use-reset-password';
import {Params} from '../helpers/params';
import {useLoader} from '../helpers/Store';

const Editor = AsyncSection<User>();

export const UserView: FC = observer(() => {
    const {api} = useBackend();

    const {params: {userId}} = useRouteMatch<Params>();
    const user = useGlobalStore();

    useEffect(() => {
        user.fetch(api.get(`/user/${userId}`), userId);
    }, [api, user, userId]);

    const _share = useLoader();
    const __share = useShare({
        title: user.data[userId]?.displayName,
        url: window.location.href,
    });
    const share = useCallback(() => {
        _share.fetch(fakeRequest(__share), userId);
    }, [__share, _share, userId]);

    const [hunter, setHunter] = useState<boolean>(false);
    const toggleHunter = useCallback(() => {
        setHunter(!hunter);
    }, [hunter]);

    const {reset, loading, data: res, error} = useResetPassword(user.data[userId]?.email);

    return (
        <Layout>
            <Grid doubling columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        {user.data[userId]?.displayName ? (
                            <Header>{possessive(user.data[userId]?.displayName)} profile</Header>
                        ) : (
                            <Header>Profile</Header>
                        )}
                    </Grid.Column>
                </Grid.Row>
                <Editor
                    id={userId}
                    store={user}
                    render={(data) => (
                        <Grid.Row>
                            <Grid.Column>
                                <Header sub>Email</Header>
                                {data.email}
                                <Header sub>Password</Header>
                                <span onClick={toggleHunter}>{hunter ? 'hunter2' : '*********'}</span>
                                <br/>
                                <Button
                                    basic
                                    size={'mini'}
                                    loading={loading}
                                    disabled={loading}
                                    onClick={reset}
                                >
                                    Reset
                                </Button>
                                <Stacktrace error={error}/>
                                <Success
                                    show={!isNil(res)}
                                    message={successMessage}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Header sub>Share profile</Header>
                                <Button
                                    basic
                                    primary
                                    onClick={share}
                                >Share</Button>
                                <Stacktrace error={_share.error[userId]}/>
                                <SilentShareMessage result={_share.data[userId]}/>
                            </Grid.Column>
                        </Grid.Row>
                    )}
                />
            </Grid>
        </Layout>
    );
});
