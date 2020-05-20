import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Grid, Header, Image, Table} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {Monster} from '../../server/model/monster';
import {observer} from 'mobx-react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useBackend} from '../helpers/BackendProvider';
import {toDataURL} from 'qrcode';
import {createUseStyles} from 'react-jss';
import {useLoader} from '../helpers/Store';
import {usePlayerId} from '../helpers/PlayerId';
import {filter, some, map} from 'lodash';
import {Stacktrace} from '../elements/Stacktrace';
import {useShare} from '../hooks/use-share';
import {AsyncSection} from '../helpers/AsyncSection';
import {abilityShort, roll, withSign} from '../helpers/display-helpers';
import {abilities, Ability} from '../../server/model/action-types';

const View = AsyncSection<Monster>();


export const qrCodeStyle = {
    marginBottom: '.5em',
};
const useStyles = createUseStyles({
    img: qrCodeStyle,
    stats: {
        '.ui.table&':
            {
                margin: '0.1em 0',
            },
    },
});

export const MonsterView: FC = observer(() => {
    const classes = useStyles();
    const {id: playerId} = usePlayerId();
    const {url, params: {monsterId}} = useRouteMatch();
    const {api} = useBackend();
    const monster = useLoader<Monster>();
    const [code, setCode] = useState<string>();
    const [refresh, setRefresh] = useState<number>(0);
    const _refresh = useCallback(() => {
        setRefresh(refresh + 1);
    }, [refresh]);
    useEffect(() => {
        const promise = api.get(`/monster/${monsterId}`)
            .then(async response => {
                const code = await toDataURL(window.location.href, {margin: 0});
                setCode(code);
                return response;
            });
        monster.fetch(promise, monsterId, refresh > 0 ? 'silent' : undefined);
    }, [api, monster, monsterId, refresh, url]);

    const {canShare, share} = useShare({
        title: monster.data[monsterId]?.name,
        url: window.location.href,
    });

    const _sub = useLoader();
    const sub = useCallback(() => {
        _sub.fetchAsync(api.post(`/monster/${monsterId}/sub`), monsterId)
            .then(_refresh);
    }, [_sub, api, monsterId, _refresh]);

    const _unsub = useLoader();
    const unsub = useCallback(() => {
        _unsub.fetchAsync(api.delete(`/monster/${monsterId}/sub`), monsterId)
            .then(_refresh);
    }, [_unsub, api, monsterId, _refresh]);

    return (
        <Layout>
            <View
                id={monsterId}
                store={monster}
                render={(data) => (
                    <Grid doubling columns={2}>
                        <Grid.Column width={16}>
                            <Header>{data.name}</Header>
                        </Grid.Column>
                        <Grid.Column>
                            <div>HP: {roll(data.HP)}</div>
                            <div>AC: {data.AC}</div>
                            <Table fixed celled unstackable className={classes.stats}>
                                <Table.Header>
                                    <Table.Row>
                                        {abilities.map(ability => (
                                            <Table.HeaderCell key={ability}>
                                                {abilityShort(ability)}
                                            </Table.HeaderCell>
                                        ))}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        {abilities.map(ability => (
                                            <Table.Cell key={ability}>
                                                {data.abilitySet[ability]}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <div>Sawing throws: {
                                map(
                                    filter(
                                        Object.entries(data.savingThrows),
                                        ([, value]) => value !== 0,
                                    ),
                                    ([ability, value]) => `${abilityShort(ability as Ability)} ${withSign(value)}`,
                                ).join(', ')
                            }</div>
                            <Header sub>Author</Header>
                            {data.owner.displayName}
                            {data.owner.id === playerId && (
                                <>
                                    <Header sub>Subscribed users</Header>
                                    <Table fixed celled unstackable>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Name</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {filter(data.subscribers, user => user.id !== monsterId).map(user => (
                                                <Table.Row key={user.id}>
                                                    <Table.Cell>{user.displayName}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </>
                            )}
                        </Grid.Column>
                        <Grid.Column>
                            <Header sub>Share monster</Header>
                            <Image src={code} alt={'QR code'} className={classes.img}/>
                            {canShare && <Button basic primary onClick={share}>Share</Button>}
                            {data.owner.id === playerId ? (
                                <>
                                    <Header sub>Edit monster</Header>
                                    <Link className={'ui button basic blue'} to={`${url}/edit`}>
                                        Edit
                                    </Link>
                                    <Stacktrace error={_unsub.error[monsterId]}/>
                                </>
                            ) : some(data.subscribers, ['id', playerId]) ? (
                                <>
                                    <Header sub>Unsubscribe from monster</Header>
                                    <Button
                                        basic
                                        color={'red'}
                                        onClick={unsub}
                                        loading={_unsub.loading[monsterId]}
                                        disabled={_unsub.loading[monsterId]}
                                    >Unsubscribe</Button>
                                    <Stacktrace error={_unsub.error[monsterId]}/>
                                </>
                            ) : (
                                <>
                                    <Header sub>Subscribe to monster</Header>
                                    <Button
                                        basic
                                        primary
                                        onClick={sub}
                                        loading={_sub.loading[monsterId]}
                                        disabled={_sub.loading[monsterId]}
                                    >Subscribe</Button>
                                    <Stacktrace error={_sub.error[monsterId]}/>
                                </>
                            )}
                        </Grid.Column>
                    </Grid>
                )}
            />
        </Layout>
    );
});
