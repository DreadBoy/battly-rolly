import React, {FC, useCallback, useEffect} from 'react';
import {Button, Grid, Header, Table, Icon, Form} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {useBackend} from '../helpers/BackendProvider';
import {Monster} from '../../server/model/monster';
import {observer} from 'mobx-react';
import {usePlayerId} from '../helpers/PlayerId';
import {Link, useRouteMatch} from 'react-router-dom';
import {useLoader} from '../helpers/Store';
import {AsyncSection} from '../helpers/AsyncSection';
import {ConfirmButton} from '../elements/ConfirmButton';
import {Stacktrace} from '../elements/Stacktrace';
import {SearchMonsters} from '../encounter/SearchMonsters';

const List = AsyncSection<Monster[]>();

export const MonsterList: FC = observer(() => {
    const {url} = useRouteMatch();
    const {api} = useBackend();
    const {id: playerId} = usePlayerId();

    const monsters = useLoader<Monster[]>();
    const fetchAll = useCallback(
        () => monsters.fetch(api.get('/monster'), playerId),
        [api, monsters, playerId],
    );
    useEffect(fetchAll, [fetchAll]);

    const _subscribe = useLoader();
    const subscribe = useCallback((monster: Monster) => {
        _subscribe.fetchAsync(api.post(`/monster/${monster.id}/sub`), 'sub')
            .then(fetchAll);
    }, [_subscribe, api, fetchAll]);

    const _leave = useLoader();
    const leave = useCallback((monsterId: string) => () => {
        _leave.fetchAsync(api.delete(`/monster/${monsterId}/sub`), 'unsub')
            .then(fetchAll);
    }, [_leave, api, fetchAll]);
    return (
        <Layout>
            <Grid doubling columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Monsters</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List
                            id={playerId}
                            store={monsters}
                            render={(data) => (
                                <>
                                    <Header sub>Your own monsters</Header>
                                    <Button
                                        basic
                                        primary
                                        size={'mini'}
                                        as={Link}
                                        to={`${url}/create`}
                                    >Create monster</Button>
                                    <Table fixed celled unstackable>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Name</Table.HeaderCell>
                                                <Table.HeaderCell/>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {data
                                                .filter(m => m.owner.id === playerId)
                                                .map(m => (
                                                    <Table.Row key={m.id}>
                                                        <Table.Cell>
                                                            <Link to={`${url}/${m.id}`}>
                                                                {m.name}
                                                            </Link>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                basic
                                                                primary
                                                                size={'mini'}
                                                                as={Link}
                                                                to={`${url}/${m.id}/edit`}
                                                            >Edit</Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                        </Table.Body>
                                    </Table>
                                </>
                            )}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Header sub>Subscribed monsters</Header>
                        <Form>
                            <SearchMonsters pool={'all'} onSelect={subscribe}/>
                            <Stacktrace error={_subscribe.error['sub']}/>
                        </Form>
                        <List
                            id={playerId}
                            store={monsters}
                            render={(data) => (
                                <>
                                    <Table fixed celled unstackable>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Name</Table.HeaderCell>
                                                <Table.HeaderCell/>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {_subscribe.loading['sub'] && (
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Icon name='spinner' color='blue' loading/>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Icon name='spinner' color='blue' loading/>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                            {data
                                                .filter(m => m.owner.id !== playerId)
                                                .map(m => (
                                                    <Table.Row key={m.id}>
                                                        <Table.Cell>
                                                            <Link to={`${url}/${m.id}`}>
                                                                {m.name}
                                                            </Link>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <>
                                                                <ConfirmButton
                                                                    size={'mini'}
                                                                    basic
                                                                    onClick={leave(m.id)}
                                                                    loading={_leave.loading['unsub']}
                                                                    disabled={_leave.loading['unsub']}
                                                                >
                                                                    Unsubscribe
                                                                </ConfirmButton>
                                                                <Stacktrace error={_leave.error['unsub']}/>
                                                            </>
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
