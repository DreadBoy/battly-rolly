import React, {FC, useCallback, useEffect} from 'react';
import {Grid, Table, Button, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {useBackend} from '../helpers/BackendProvider';
import {useStore} from '../helpers/StoreProvider';
import {LoadingFactory} from '../helpers/Loading';
import {Campaign} from '../../../server/model/campaign';
import {observer} from 'mobx-react';
import {usePlayerId} from '../helpers/PlayerId';
import {ConfirmButton} from '../helpers/ConfirmButton';
import {Link, useRouteMatch} from 'react-router-dom';
import {useSimpleStore} from '../helpers/Store';
import {Stacktrace} from '../helpers/Stacktrace';

const List = LoadingFactory<Campaign[]>();

export const CampaignList: FC = observer(() => {
    const {url} = useRouteMatch();
    const {api} = useBackend();
    const {id} = usePlayerId();
    const {campaigns} = useStore();
    useEffect(() => {
        campaigns.fetch(api.get('/campaign'), id);
    }, [api, campaigns, id]);

    const _leave = useSimpleStore();
    const leave = useCallback((campaignId: string) => () => {
        _leave.fetchAsync(api.delete(`/campaign/${campaignId}/user`, {data: {id}}), campaignId)
            .then(() => campaigns.fetch(api.get('/campaign'), id));
    }, [_leave, api, id, campaigns]);
    return (
        <Layout title={'Campaigns'}>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Campaigns</Header>
                        <Button.Group>
                            <Button basic color={'grey'}>Join campaign</Button>
                            <Link to={`${url}/edit`} className={'ui button basic blue'}>Create campaign</Link>
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List
                            id={id}
                            store={campaigns}
                            render={(data) => (
                                <>
                                    <Header size={'tiny'}>Joined campaigns</Header>
                                    <Table fixed celled unstackable>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Name</Table.HeaderCell>
                                                <Table.HeaderCell/>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {data.map(row => (
                                                <Table.Row key={row.id}>
                                                    <Table.Cell>
                                                        <Link to={`${url}/${row.id}`}>
                                                            {row.name}
                                                        </Link>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {row.gm.id === id ? (
                                                            <Link
                                                                to={`${url}/${row.id}/edit`}
                                                                className={'ui button basic mini blue'}
                                                            >Edit</Link>
                                                        ) : (
                                                            <>
                                                                <ConfirmButton
                                                                    basic
                                                                    onClick={leave(row.id)}
                                                                    loading={_leave.loading[row.id]}
                                                                    disabled={_leave.loading[row.id]}
                                                                >Leave</ConfirmButton>
                                                                <Stacktrace error={_leave.error[row.id]}/>
                                                            </>
                                                        )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </>
                            )}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
