import React, {FC} from 'react';
import {Header, Table} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../../server/model/encounter';
import {isEmpty, map, nth, sortBy, toArray} from 'lodash';
import {featureToDisplay, multiline, success} from '../../../helpers/display-helpers';

type Props = {
    encounter: Encounter,
}

export const AllLogs: FC<Props> = observer(({encounter}) => {

    const logs = sortBy(toArray(encounter.logs), 'createdAt');

    return !isEmpty(logs) ? (
        <>
            <Header size={'small'}>All Logs</Header>
            <Table fixed celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Attacker</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Target</Table.HeaderCell>
                        <Table.HeaderCell>Attack</Table.HeaderCell>
                        <Table.HeaderCell>Result</Table.HeaderCell>
                        <Table.HeaderCell>Damage</Table.HeaderCell>
                        <Table.HeaderCell>Confirmed</Table.HeaderCell>
                        <Table.HeaderCell>Stage</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {map(logs, l => (
                        <Table.Row>
                            <Table.Cell>{l.name}</Table.Cell>
                            <Table.Cell>{featureToDisplay(l.source[0])}</Table.Cell>
                            <Table.Cell>{l.type}</Table.Cell>
                            <Table.Cell>{multiline(l.target, featureToDisplay)}</Table.Cell>
                            {l.type === 'direct' ? (
                                <Table.Cell>{l.attack} to hit</Table.Cell>
                            ) : (
                                <Table.Cell>{l.DC} {l.stat}</Table.Cell>
                            )}
                            <Table.Cell>{multiline(l.success, (s, index) =>
                                l.type === 'direct' ? success(s) : <>{success(s)} {nth(l.throw, index)}</>,
                            )}</Table.Cell>
                            <Table.Cell>
                                {l.damage} {l.damageType}
                                <br/>
                                {l.status}
                            </Table.Cell>
                            <Table.Cell>{multiline(l.confirmed, (c, index) =>
                                l.success[index] ? success(c) : '')}</Table.Cell>
                            <Table.Cell>{l.stage}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>

            </Table>
        </>
    ) : null;
});
