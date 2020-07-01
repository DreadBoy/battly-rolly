import React, {FC} from 'react';
import {Header, Icon, Table} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../server/model/encounter';
import {isEmpty, isNil, map, nth, sortBy, toArray} from 'lodash';
import {featureToDisplay, multiline, success} from '../../../helpers/display-helpers';
import {Log} from '../../../../server/model/log';

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
                        <Table.Row key={l.id}>
                            <Table.Cell>{l.name}</Table.Cell>
                            <Table.Cell>{featureToDisplay(l.source[0])}</Table.Cell>
                            <Table.Cell>{l.type}</Table.Cell>
                            <Table.Cell>{multiline(l.target, featureToDisplay)}</Table.Cell>
                            <Table.Cell>{toHit(l)}</Table.Cell>
                            <Table.Cell>{multiline(l.success, (s, index) =>
                                l.type === 'direct' ? success(s) : <>{success(s)} {nth(l.throw, index)}</>,
                            )}</Table.Cell>
                            <Table.Cell>
                                {damage(l)}
                                <br/>
                                {l.status}
                            </Table.Cell>
                            <Table.Cell>{multiline(l.confirmed, (c, index) =>
                                (l.success[index] || !isNil(l.damageFailure)) ? success(c) : '')}</Table.Cell>
                            <Table.Cell>{l.stage}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>

            </Table>
        </>
    ) : null;
});

function toHit(l: Log) {
    if (l.type === 'direct') {
        if (l.nat20) {
            const icon = (<Icon name='exclamation' color='orange'/>);
            return (<>{icon}NAT 20{icon}</>);
        }
        return `${l.attack} to hit`;
    } else {
        return `${l.DC} ${l.stat}`;
    }
}

function damage(l: Log) {
    if (l.type === 'direct' && l.success[0] && isNil(l.damageSuccess))
        return (
            <Icon name='spinner' color='blue' loading/>
        )
    if (!l.damageFailure)
        return (
            <>{l.damageSuccess} {l.damageType}</>
        )
    return (
        <>{l.damageSuccess}/{l.damageFailure} {l.damageType}</>
    );
}
