import React, {FC, useCallback} from 'react';
import {Button, Header, Table} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {ConfirmButton} from '../helpers/ConfirmButton';
import {Link, useHistory, useRouteMatch} from 'react-router-dom';
import {useSimpleStore, useLoader} from '../helpers/Store';
import {useBackend} from '../helpers/BackendProvider';
import {Stacktrace} from '../helpers/Stacktrace';
import {Campaign} from '../../../server/model/campaign';
import {Encounter} from '../../../server/model/encounter';

type Props = {
    campaign: Campaign,
    refresh: () => void,
};

export const EncounterList: FC<Props> = observer(({campaign: {id: campaignId, encounters}, refresh}) => {
    const {url} = useRouteMatch();
    const base = url.replace(/\/campaign.*$/, '');
    const {api} = useBackend();
    const { push } = useHistory();

    const _remove = useSimpleStore();
    const remove = useCallback((id: string) => () => {
        _remove.fetchAsync(api.delete(`/encounter/${id}`), id)
            .then(refresh)
            .catch(() => undefined);
    }, [_remove, api, refresh]);

    const _create = useLoader<Encounter>();
    const create = useCallback(() => {
        _create.fetchAsync(api.post(`campaign/${campaignId}/encounter`), 'create')
            .then((encounter) => push(`${base}/encounter/${encounter.id}`))
            .catch(() => undefined);
    }, [_create, api, base, campaignId, push]);

    return (
        <>
            <Header size={'tiny'}>Encounters</Header>
            <Table fixed celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>CR</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {encounters.map(enc => (
                        <Table.Row key={enc.id}>
                            <Table.Cell>8</Table.Cell>
                            <Table.Cell>
                                <Link
                                    to={`${base}/encounter/${enc.id}/edit`}
                                    className={'ui button basic mini blue'}
                                >Edit</Link>
                                <ConfirmButton
                                    basic
                                    size={'mini'}
                                    onClick={remove(enc.id)}
                                    loading={_remove.loading[enc.id]}
                                    disabled={_remove.loading[enc.id]}
                                >Delete</ConfirmButton>
                                <Stacktrace error={_remove.error[enc.id]}/>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Button
                basic
                primary
                onClick={create}
                loading={_create.loading['create']}
                disabled={_create.loading['create']}
            >Create</Button>
            <Stacktrace error={_create.error['create']}/>
        </>
    );
});
