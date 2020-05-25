import React, {FC, useCallback, useEffect} from 'react';
import {Button, Grid, Header, Table} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {useBackend} from '../helpers/BackendProvider';
import {Campaign} from '../../server/model/campaign';
import {observer} from 'mobx-react';
import {usePlayerId} from '../helpers/PlayerId';
import {ConfirmButton} from '../elements/ConfirmButton';
import {Link, useRouteMatch} from 'react-router-dom';
import {useLoader} from '../helpers/Store';
import {Stacktrace} from '../elements/Stacktrace';
import {AsyncSection} from '../helpers/AsyncSection';

const List = AsyncSection<Campaign[]>();

export const CampaignList: FC = observer(() => {
    const {url} = useRouteMatch();
    const {api} = useBackend();
    const {id} = usePlayerId();
    const campaigns = useLoader<Campaign[]>();
    useEffect(() => {
        campaigns.fetch(api.get('/campaign'), id);
    }, [api, campaigns, id]);

    const _leave = useLoader();
    const leave = useCallback((campaignId: string) => () => {
        _leave.fetchAsync(api.delete(`/campaign/${campaignId}/user`, {data: {id}}), campaignId)
            .then(() => campaigns.fetch(api.get('/campaign'), id));
    }, [_leave, api, id, campaigns]);
    return (
        <Layout>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Campaigns</Header>
                        <Button basic primary size={'tiny'} as={Link} to={`${url}/create`}>Create campaign</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List
                            id={id}
                            store={campaigns}
                            render={(data) => (
                                <>
                                    <Header sub>Joined campaigns</Header>
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
