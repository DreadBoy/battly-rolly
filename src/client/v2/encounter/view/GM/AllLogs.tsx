import React, {FC} from 'react';
import {Header, Table} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../../server/model/encounter';
import {isEmpty, map, toArray, sortBy} from 'lodash';
import {featureToDisplay, success} from '../../../helpers/display-helpers';

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
                        <Table.HeaderCell>Stage</Table.HeaderCell>
                        <Table.HeaderCell>Attack</Table.HeaderCell>
                        <Table.HeaderCell>Result</Table.HeaderCell>
                        <Table.HeaderCell>Damage</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {map(logs, l => (
                        <Table.Row>
                            <Table.Cell>{l.name}</Table.Cell>
                            <Table.Cell>{featureToDisplay(l.source[0])}</Table.Cell>
                            <Table.Cell>{l.type}</Table.Cell>
                            <Table.Cell>{map(l.target, featureToDisplay).join(', ')}</Table.Cell>
                            <Table.Cell>{l.stage}</Table.Cell>
                            {l.type === 'direct' ? (
                                <Table.Cell>{l.attack}</Table.Cell>
                            ) : (
                                <Table.Cell>{l.DC} {l.stat}</Table.Cell>
                            )}
                            {l.type === 'direct' ? (
                                <Table.Cell>{success(l.success)}</Table.Cell>
                            ) : (
                                <Table.Cell>
                                    {success(l.success)}
                                    {l.success && (
                                        <>
                                            <br/>
                                            {l.throw} {l.stat}
                                        </>
                                    )}
                                </Table.Cell>
                            )}
                            <Table.Cell>
                                {l.damage} {l.damageType}
                                <br/>
                                {l.status}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>

            </Table>
        </>
    ) : null;
});
