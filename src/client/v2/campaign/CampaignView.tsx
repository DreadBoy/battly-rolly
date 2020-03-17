import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Grid, Header, Image, Table} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {Campaign} from '../../../server/model/campaign';
import {observer} from 'mobx-react';
import {useStore} from '../helpers/StoreProvider';
import {LoadingFactory} from '../helpers/Loading';
import {Link, useRouteMatch} from 'react-router-dom';
import {useBackend} from '../helpers/BackendProvider';
import {toDataURL} from 'qrcode';
import {createUseStyles} from 'react-jss';
import {useSimpleStore} from '../helpers/Store';
import {usePlayerId} from '../helpers/PlayerId';
import {some} from 'lodash';
import {Stacktrace} from '../helpers/Stacktrace';
import {ConfirmButton} from '../helpers/ConfirmButton';

const Editor = LoadingFactory<Campaign>();

const useStyles = createUseStyles({
    img: {
        marginBottom: '.5em',
    },
});

export const CampaignView: FC = observer(() => {
    const classes = useStyles();
    const {id: playerId} = usePlayerId();
    const {url, params: {id}} = useRouteMatch();
    const {api} = useBackend();
    const {campaign} = useStore();
    const [code, setCode] = useState<string>();
    useEffect(() => {
        const promise = api.get(`/campaign/${id}`)
            .then(async response => {
                const code = await toDataURL(window.location.href, {margin: 0});
                setCode(code);
                return response;
            });
        campaign.fetch(promise, id);
    }, [api, campaign, id, url]);

    const canShare = navigator.share && navigator.canShare;
    const share = useCallback(() => {
        if (!navigator.share || !navigator.canShare) return;
        const data = {
            title: campaign.data[id].name,
            url: window.location.href,
        };
        if (navigator.canShare(data))
            navigator.share(data).catch((e) => console.error(e));
    }, [campaign.data, id]);

    const _join = useSimpleStore();
    const join = useCallback(() => {
        _join.fetchAsync(api.post(`/campaign/${id}/user`), id)
            .then(() => campaign.fetch(api.get(`/campaign/${id}`), id));
    }, [_join, api, id, campaign]);

    const _leave = useSimpleStore();
    const leave = useCallback(() => {
        _leave.fetchAsync(api.delete(`/campaign/${id}/user`, {data: {id: playerId}}), id)
            .then(() => campaign.fetch(api.get(`/campaign/${id}`), id));
    }, [_leave, api, id, playerId, campaign]);

    const _kick = useSimpleStore();
    const kick = useCallback((playerId) => () => {
        _kick.fetchAsync(api.delete(`/campaign/${id}/user`, {data: {id: playerId}}), playerId)
            .then(() => campaign.fetch(api.get(`/campaign/${id}`), id));
    }, [_kick, api, id, campaign]);

    return (
        <Layout title={<Link to={url.replace(/\/campaign.*$/, '/campaign')}>Campaigns</Link>}>
            <Editor
                id={id}
                store={campaign}
                render={(data) => (
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header>{data.name}</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header size={'tiny'}>Share campaign</Header>
                                <Image src={code} alt={'QR code'} className={classes.img}/>
                                {canShare && <Button basic primary onClick={share}>Share</Button>}
                            </Grid.Column>
                            {!some(data.users, ['id', playerId]) ? (
                                <Grid.Column>
                                    <Header size={'tiny'}>Join campaign</Header>
                                    <Button
                                        basic
                                        primary
                                        onClick={join}
                                        loading={_join.loading[id]}
                                        disabled={_join.loading[id]}
                                    >Join</Button>
                                    <Stacktrace error={_join.error[id]}/>
                                </Grid.Column>
                            ) : data.gm.id !== playerId ? (
                                <Grid.Column>
                                    <Header size={'tiny'}>Leave campaign</Header>
                                    <Button
                                        basic
                                        color={'red'}
                                        onClick={leave}
                                        loading={_leave.loading[id]}
                                        disabled={_leave.loading[id]}
                                    >Leave</Button>
                                    <Stacktrace error={_leave.error[id]}/>
                                </Grid.Column>
                            ) : (
                                <Grid.Column>
                                    <Header size={'tiny'}>Edit campaign</Header>
                                    <Link className={'ui button basic blue'} to={`${url}/edit`}>
                                        Edit
                                    </Link>
                                    <Stacktrace error={_leave.error[id]}/>
                                </Grid.Column>
                            )}
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header size={'tiny'}>Dungeon master</Header>
                                {data.gm.name}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header size={'tiny'}>Joined users</Header>
                                <Table fixed celled unstackable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell/>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {data.users.filter(user => user.id !== id).map(user => (
                                            <Table.Row key={user.id}>
                                                <Table.Cell>{user.name || user.id}</Table.Cell>
                                                <Table.Cell>
                                                    {user.id !== data.gm.id && (
                                                        <ConfirmButton
                                                            basic
                                                            size={'tiny'}
                                                            onClick={kick(user.id)}
                                                            loading={_kick.loading[user.id]}
                                                            disabled={_kick.loading[user.id]}
                                                        >Kick</ConfirmButton>
                                                    )}
                                                    <Stacktrace error={_kick.error[user.id]}/>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )}
            />
        </Layout>
    );
});
