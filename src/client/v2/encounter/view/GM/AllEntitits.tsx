import React, {FC, useCallback} from 'react';
import {Grid, Header, List} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../../server/model/encounter';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Feature} from '../../../../../server/model/feature';
import {featureToDisplay} from '../../../helpers/display-helpers';
import {filter, map} from 'lodash';

type Props = {
    encounter: Encounter,
}

export const AllEntities: FC<Props> = observer(({encounter}) => {
    const silentLoader = useLoader();
    const {api} = useBackend();

    const onRemove = useCallback((feature: Partial<Feature>) => () => {
        silentLoader.fetch(api.delete(`/encounter/${encounter.id}/feature`, {data: {features: [feature]}}), 'remove');
    }, [api, encounter.id, silentLoader]);

    return encounter.features.length > 0 ? (
        <>
            <Header size={'small'}>All entities</Header>
            <Grid columns={2}>
                <Grid.Column><Header size={'tiny'}>Monsters</Header>
                    <List>
                        {map(
                            filter(encounter.features, f => f.type === 'npc'),
                            (f, index) => (
                                <List.Item key={index}>
                                    <List.Icon
                                        link
                                        name='close'
                                        onClick={onRemove(f)}
                                    />
                                    <List.Content>{featureToDisplay(f)} {f.HP} / {f.initialHP}</List.Content>
                                </List.Item>
                            ),
                        )}
                    </List>
                </Grid.Column>
                <Grid.Column><Header size={'tiny'}>Players</Header>
                    <List>
                        {map(
                            filter(encounter.features, f => f.type === 'player'),
                            (f, index) => (
                                <List.Item key={index}>
                                    <List.Icon
                                        link
                                        name='close'
                                        onClick={onRemove(f)}
                                    />
                                    <List.Content>{featureToDisplay(f)} {f.HP} / {f.initialHP}</List.Content>
                                </List.Item>
                            ))}
                    </List>
                </Grid.Column>
            </Grid>
        </>
    ) : null;
});
