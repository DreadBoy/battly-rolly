import React, {FC, useEffect} from 'react';
import {Grid, Table} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {useBackend} from '../helpers/BackendProvider';
import {useStore} from '../helpers/StoreProvider';
import {LoadingFactory} from '../helpers/Loading';
import {Campaign} from '../../../server/model/campaign';
import {observer} from 'mobx-react';
import {usePlayerId} from '../helpers/PlayerId';
import {ConfirmButton} from '../helpers/ConfirmButton';

const List = LoadingFactory<Campaign[]>();

export const CampaignList: FC = observer(() => {
    const {api} = useBackend();
    const {id} = usePlayerId();
    const {campaigns} = useStore();
    useEffect(() => {
        campaigns.fetch(api.get('/campaign'), id);
    }, [api, campaigns, id]);
    return (
        <Layout title={'Campaigns'}>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <List
                            id={id}
                            store={campaigns}
                            render={(data) => (
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
                                                <Table.Cell>Tales of Tessalonia</Table.Cell>
                                                <Table.Cell>
                                                    <ConfirmButton onClick={() => alert('leave')}>Leave</ConfirmButton>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
