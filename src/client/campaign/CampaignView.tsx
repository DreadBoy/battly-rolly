import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Grid, Header, Image, Table} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {Campaign} from '../../server/model/campaign';
import {observer} from 'mobx-react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useBackend} from '../helpers/BackendProvider';
import {toDataURL} from 'qrcode';
import {createUseStyles} from 'react-jss';
import {useLoader} from '../helpers/Store';
import {usePlayerId} from '../helpers/PlayerId';
import {some} from 'lodash';
import {Stacktrace} from '../elements/Stacktrace';
import {ConfirmButton} from '../elements/ConfirmButton';
import {EncounterList} from '../encounter/EncounterList';
import {useShare} from '../hooks/use-share';
import {AsyncSection} from '../helpers/AsyncSection';

const Editor = AsyncSection<Campaign>();


export const qrCodeStyle = {
    marginBottom: '.5em',
};
const useStyles = createUseStyles({
    img: qrCodeStyle,
});

export const CampaignView: FC = observer(() => {
    const classes = useStyles();
    const {id: playerId} = usePlayerId();
    const {url, params: {campaignId: id}} = useRouteMatch();
    const {api} = useBackend();
    const campaign = useLoader<Campaign>();
    const [code, setCode] = useState<string>();
    const [refresh, setRefresh] = useState<number>(0);
    const _refresh = useCallback(() => {
        setRefresh(refresh + 1);
    }, [refresh]);
    useEffect(() => {
        const promise = api.get(`/campaign/${id}`)
            .then(async response => {
                const code = await toDataURL(window.location.href, {margin: 0});
                setCode(code);
                return response;
            });
        campaign.fetch(promise, id, refresh > 0 ? 'silent' : undefined);
    }, [api, campaign, id, refresh, url]);

    const {canShare, share} = useShare({
        title: campaign.data[id]?.name,
        url: window.location.href,
    });

    const _join = useLoader();
    const join = useCallback(() => {
        _join.fetchAsync(api.post(`/campaign/${id}/user`), id)
            .then(() => campaign.fetch(api.get(`/campaign/${id}`), id));
    }, [_join, api, id, campaign]);

    const _leave = useLoader();
    const leave = useCallback(() => {
        _leave.fetchAsync(api.delete(`/campaign/${id}/user`, {data: {id: playerId}}), id)
            .then(() => campaign.fetch(api.get(`/campaign/${id}`), id));
    }, [_leave, api, id, playerId, campaign]);

    const _kick = useLoader();
    const kick = useCallback((playerId) => () => {
        _kick.fetchAsync(api.delete(`/campaign/${id}/user`, {data: {id: playerId}}), playerId)
            .then(() => campaign.fetch(api.get(`/campaign/${id}`), id));
    }, [_kick, api, id, campaign]);

    return (
        <Layout>
            <Editor
                id={id}
                store={campaign}
                render={(data) => (
                    <Grid doubling columns={2}>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header>{data.name}</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header sub>Share campaign</Header>
                                <Image src={code} alt={'QR code'} className={classes.img}/>
                                {canShare && <Button basic primary onClick={share}>Share</Button>}
                            </Grid.Column>
                            {!some(data.users, ['id', playerId]) ? (
                                <Grid.Column>
                                    <Header sub>Join campaign</Header>
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
                                    <Header sub>Leave campaign</Header>
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
                                    <Header sub>Edit campaign</Header>
                                    <Link className={'ui button basic blue'} to={`${url}/edit`}>
                                        Edit
                                    </Link>
                                    <Stacktrace error={_leave.error[id]}/>
                                </Grid.Column>
                            )}
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header sub>Dungeon master</Header>
                                {data.gm.displayName}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header sub>Joined users</Header>
                                <Table fixed celled unstackable>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            {playerId === data.gm.id && <Table.HeaderCell/>}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {data.users.filter(user => user.id !== id).map(user => (
                                            <Table.Row key={user.id}>
                                                <Table.Cell>{user.displayName}</Table.Cell>
                                                {playerId === data.gm.id && (
                                                    <Table.Cell>
                                                        {user.id !== data.gm.id && (
                                                            <ConfirmButton
                                                                basic
                                                                size={'mini'}
                                                                onClick={kick(user.id)}
                                                                loading={_kick.loading[user.id]}
                                                                disabled={_kick.loading[user.id]}
                                                            >Kick</ConfirmButton>
                                                        )}
                                                        <Stacktrace error={_kick.error[user.id]}/>
                                                    </Table.Cell>
                                                )}
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            {playerId === data.gm.id && (
                                <Grid.Column>
                                    <EncounterList campaign={data} refresh={_refresh}/>
                                </Grid.Column>
                            )}
                        </Grid.Row>
                    </Grid>
                )}
            />
        </Layout>
    );
});