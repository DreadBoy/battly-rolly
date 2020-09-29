import React, {FC, useCallback, useEffect} from 'react';
import {Button, Grid, Header, Table} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {Campaign} from '../../server/model/campaign';
import {observer} from 'mobx-react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useBackend} from '../helpers/BackendProvider';
import {useLoader} from '../helpers/Store';
import {usePlayerId} from '../helpers/PlayerId';
import {some} from 'lodash';
import {Stacktrace} from '../elements/Stacktrace';
import {ConfirmButton} from '../elements/ConfirmButton';
import {EncounterListGM} from '../encounter/list/EncounterListGM';
import {EncounterListPlayer} from '../encounter/list/EncounterListPlayer';
import {useShare} from '../hooks/use-share';
import {AsyncSection} from '../helpers/AsyncSection';
import {useGlobalStore} from '../helpers/GlobalStore';

const Editor = AsyncSection<Campaign>();

export const CampaignView: FC = observer(() => {
    const {id: playerId} = usePlayerId();
    const {url, params: {campaignId: id}} = useRouteMatch();
    const {api} = useBackend();
    const campaign = useGlobalStore();

    useEffect(() => {
        campaign.fetch(api.get(`/campaign/${id}`), id);
    }, [api, campaign, id, url]);

    const {canShare, share} = useShare({
        title: campaign.data[id]?.name,
        url: window.location.href,
    });

    const _join = useLoader();
    const join = useCallback(() => {
        _join.fetch(api.post(`/campaign/${id}/user`), id);
    }, [_join, api, id]);

    const _leave = useLoader();
    const leave = useCallback(() => {
        _leave.fetch(api.delete(`/campaign/${id}/user`, {data: {id: playerId}}), id);
    }, [_leave, api, id, playerId]);

    const _kick = useLoader();
    const kick = useCallback((playerId) => () => {
        _kick.fetch(api.delete(`/campaign/${id}/user`, {data: {id: playerId}}), id);
    }, [_kick, api, id]);

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
                            {canShare && (
                                <Grid.Column>
                                    <Header sub>Share campaign</Header>
                                    <Button basic primary onClick={share}>Share</Button>
                                </Grid.Column>
                            )}
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
                                                                loading={_kick.loading[id]}
                                                                disabled={_kick.loading[id]}
                                                            >Kick</ConfirmButton>
                                                        )}
                                                        <Stacktrace error={_kick.error[id]}/>
                                                    </Table.Cell>
                                                )}
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            {playerId === data.gm.id ? (
                                <Grid.Column>
                                    <EncounterListGM campaign={data}/>
                                </Grid.Column>
                            ) : (
                                <Grid.Column>
                                    <EncounterListPlayer campaign={data}/>
                                </Grid.Column>
                            )}
                        </Grid.Row>
                    </Grid>
                )}
            />
        </Layout>
    );
});
