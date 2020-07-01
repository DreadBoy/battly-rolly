import React, {FC} from 'react';
import {Grid, Header, List} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../server/model/encounter';
import {featureToDisplay} from '../../../helpers/display-helpers';
import {filter, map} from 'lodash';
import {type} from '../../../../server/model/helpers';
import {MonsterHP} from './MonsterHP';
import {MonsterName} from './MonsterName';

type Props = {
    encounter: Encounter,
}

export const AllEntities: FC<Props> = observer(({encounter}) => {
    return encounter.features.length > 0 ? (
        <>
            <Header size={'small'}>All entities</Header>
            <Grid columns={2}>
                <Grid.Column><Header sub>Monsters</Header>
                    <List>
                        {map(
                            filter(encounter.features, f => type(f) === 'npc'),
                            (f, index) => (
                                <List.Item key={index}>
                                    <List.Content>
                                        <MonsterName feature={f}/>
                                        <MonsterHP id={f.id} HP={f.HP} initialHP={f.initialHP}/>
                                    </List.Content>
                                </List.Item>
                            ),
                        )}
                    </List>
                </Grid.Column>
                <Grid.Column><Header sub>Players</Header>
                    <List>
                        {map(
                            filter(encounter.features, f => type(f) === 'player'),
                            (f, index) => (
                                <List.Item key={index}>
                                    <List.Content>{featureToDisplay(f)}</List.Content>
                                </List.Item>
                            ))}
                    </List>
                </Grid.Column>
            </Grid>
        </>
    ) : null;
});
