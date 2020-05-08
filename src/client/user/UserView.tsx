import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Grid, Header, Image} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {observer} from 'mobx-react';
import {useLoader} from '../helpers/Store';
import {User} from '../../server/model/user';
import {useRouteMatch} from 'react-router';
import {toDataURL} from 'qrcode';
import {useBackend} from '../helpers/BackendProvider';
import {createUseStyles} from 'react-jss';
import {qrCodeStyle} from '../campaign/CampaignView';
import {useShare} from '../hooks/use-share';
import {possessive} from '../helpers/display-helpers';
import {AsyncSection} from '../helpers/AsyncSection';

const Editor = AsyncSection<User>();

const useStyles = createUseStyles({
    img: qrCodeStyle,
});
export const UserView: FC = observer(() => {
    const classes = useStyles();
    const {api} = useBackend();

    const {params: {userId}} = useRouteMatch();
    const user = useLoader<User>();
    const [code, setCode] = useState<string>();

    useEffect(() => {
        const promise = api.get(`/user/${userId}`)
            .then(async response => {
                const code = await toDataURL(window.location.href, {margin: 0});
                setCode(code);
                return response;
            });
        user.fetch(promise, userId);
    }, [api, user, userId]);

    const {canShare, share} = useShare({
        title: user.data[userId]?.displayName,
        url: window.location.href,
    });

    const [hunter, setHunter] = useState<boolean>(false);
    const toggleHunter = useCallback(() => {
        setHunter(!hunter);
    }, [hunter]);

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
                        <>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header sub>Email</Header>
                                    {data.email}
                                    <br/>
                                    <Button basic size={'mini'}>Change</Button>

                                    <Header sub>Password</Header>
                                    <span onClick={toggleHunter}>{hunter ? 'hunter2' : '*********'}</span>
                                    <br/>
                                    <Button basic size={'mini'}>Reset</Button>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header sub>Share profile</Header>
                                    <Image src={code} alt={'QR code'} className={classes.img}/>
                                    {canShare && <Button basic primary onClick={share}>Share</Button>}
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    )}
                />
            </Grid>
        </Layout>
    );
});
