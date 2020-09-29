import React, {FC} from 'react';
import {Header, Table} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Link, useRouteMatch} from 'react-router-dom';
import {Campaign} from '../../../server/model/campaign';
import {filter, map} from 'lodash';

type Props = {
    campaign: Campaign,
};

export const EncounterListPlayer: FC<Props> = observer(({campaign: {encounters}}) => {
    const {url} = useRouteMatch();

    return (
        <>
            <Header sub>Encounters</Header>
            <Table celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {map(filter(encounters, 'active'), enc => (
                        <Table.Row key={enc.id}>
                            <Table.Cell>{
                                <Link to={`${url}/encounter/${enc.id}`}>{enc.name}</Link>
                            }</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
});
