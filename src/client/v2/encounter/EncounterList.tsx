import React, {FC, useCallback} from 'react';
import {Checkbox, Header, Loader, Table} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {ConfirmButton} from '../helpers/ConfirmButton';
import {Link, useRouteMatch} from 'react-router-dom';
import {useLoader} from '../helpers/Store';
import {useBackend} from '../helpers/BackendProvider';
import {Stacktrace} from '../helpers/Stacktrace';
import {Encounter} from '../../../server/model/encounter';

type Props = {
    encounters: Encounter[],
    refresh: () => void,
};

export const EncounterList: FC<Props> = observer(({encounters, refresh}) => {
    const {url} = useRouteMatch();
    const {api} = useBackend();

    const _remove = useLoader();
    const remove = useCallback((id: string) => () => {
        _remove.fetchAsync(api.delete(`/encounter/${id}`), id)
            .then(refresh)
            .catch(() => undefined);
    }, [_remove, api, refresh]);

    const _active = useLoader();
    const setActive = useCallback((id: string) => () => {
        _active.fetchAsync(api.post(`/encounter/${id}/active`), id)
            .then(refresh)
            .catch(() => undefined);
    }, [_active, api, refresh]);

    return (
        <>
            <Header size={'tiny'}>Encounters</Header>
            <Table celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Active</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {encounters.map(enc => (
                        <Table.Row key={enc.id}>
                            <Table.Cell>
                                {_active.loading[enc.id] ? (
                                    <Loader active size={'small'} inline={true}/>
                                ) : (
                                    <Checkbox
                                        toggle
                                        checked={enc.active}
                                        onChange={setActive(enc.id)}
                                    />
                                )}
                                {_active.error[enc.id] && (
                                    <Stacktrace error={_active.error[enc.id]}/>
                                )}
                            </Table.Cell>
                            <Table.Cell>{enc.name}</Table.Cell>
                            <Table.Cell>
                                <Link
                                    to={`${url}/encounter/${enc.id}/edit`}
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
            <Link className={'ui button basic blue'} to={`${url}/encounter/create`}>Create</Link>
        </>
    );
});
