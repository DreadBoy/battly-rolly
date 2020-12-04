import React, {FC, Fragment, useCallback, useEffect} from 'react';
import {Button, Grid, Header, Table} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {Monster} from '../../server/model/monster';
import {observer} from 'mobx-react';
import {Link, useRouteMatch} from 'react-router-dom';
import {fakeRequest, useBackend} from '../helpers/BackendProvider';
import {createUseStyles} from 'react-jss';
import {useLoader} from '../helpers/Store';
import {useGlobalStore} from '../helpers/GlobalStore';
import {usePlayerId} from '../helpers/PlayerId';
import {filter, isNil, map, some} from 'lodash';
import {Stacktrace} from '../elements/Stacktrace';
import {SilentShareMessage, useShare} from '../hooks/use-share';
import {AsyncSection} from '../helpers/AsyncSection';
import {abilityShort, roll, withSign} from '../helpers/display-helpers';
import {abilities, Ability, Roll} from '../../server/model/action-types';
import {Action} from '../../server/model/action';
import {toJS} from 'mobx';
import {Params} from '../helpers/params';

const View = AsyncSection<Monster>();

const useStyles = createUseStyles({
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
    const {url, params: {monsterId}} = useRouteMatch<Params>();
    const {api} = useBackend();
    const monster = useGlobalStore();
    useEffect(() => {
        monster.fetch(api.get(`/monster/${monsterId}`), monsterId);
    }, [api, monster, monsterId, url]);

    const _share = useLoader();
    const __share = useShare({
        title: monster.data[monsterId]?.name,
        url: window.location.href,
    });
    const share = useCallback(() => {
        _share.fetch(fakeRequest(__share), monsterId);
    }, [__share, _share, monsterId]);

    const _sub = useLoader();
    const sub = useCallback(() => {
        _sub.fetch(api.post(`/monster/${monsterId}/sub`), monsterId);
    }, [_sub, api, monsterId]);

    const _unsub = useLoader();
    const unsub = useCallback(() => {
        _unsub.fetch(api.delete(`/monster/${monsterId}/sub`), monsterId);
    }, [_unsub, api, monsterId]);

    const savingThrows = useCallback((data: Monster) => filter(
        Object.entries(data.savingThrows),
        ([, value]) => value !== 0,
    ), []);

    const actionDescription = useCallback((action: Action): string => {
        console.log(toJS(action));
        let base = '';
        if (action.type === 'direct') {
            base += `Weapon Attack: +${action.modifier} to hit, one target.`;
            if (!isNil(action.damage))
                base += ` Hit: ${roll(action.damage.roll as Roll, 'leading-average')} ${action.damage.damageType} damage.`
            if (!isNil(action.status))
                base += ` On a successful attack, the target is ${action.status}.`;
        } else {
            base += `Each target must make a DC ${action.DC} ${action.ability} saving throw`;
            if (!isNil(action.damage)) {
                base += `, taking ${roll(action.damage?.roll as Roll, 'leading-average')} ${action.damage?.damageType} damage on a failed save`;
                if (action.takeHalfOnFailure)
                    base += `, or half as much damage on a successful one`;
            }
            base += '.';
            if (!isNil(action.status)) {
                base += ` On a failed save, the targets are ${action.status}.`;
            }
        }

        return base;
    }, []);

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
                            {savingThrows(data).length > 0 && (
                                <div>Sawing throws: {
                                    map(savingThrows(data),
                                        ([ability, value]) => `${abilityShort(ability as Ability)} ${withSign(value)}`,
                                    ).join(', ')
                                }</div>
                            )}
                            {data.actions?.length > 0 && (
                                <>
                                    {data.actions.map(action => (
                                        <Fragment key={action.id}>
                                            <Header sub>{action.name}</Header>
                                            <div>{actionDescription(action)}</div>
                                        </Fragment>
                                    ))}
                                </>
                            )}
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
                            <Header sub>Share monster</Header>
                            <Button
                                basic
                                primary
                                onClick={share}
                            >Share</Button>
                            <Stacktrace error={_share.error[monsterId]}/>
                            <SilentShareMessage result={_share.data[monsterId]}/>
                        </Grid.Column>
                    </Grid>
                )}
            />
        </Layout>
    );
});
