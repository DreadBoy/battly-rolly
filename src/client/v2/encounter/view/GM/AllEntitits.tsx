import React, {FC, useCallback} from 'react';
import {Grid, Header, List} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../../server/model/encounter';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Feature} from '../../../../../server/model/feature';

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
                        {encounter.features
                            .filter(f => f.type === 'npc')
                            .map((f, index) => (
                                <List.Item key={index}>
                                    <List.Icon
                                        link
                                        name='close'
                                        onClick={onRemove(f)}
                                    />
                                    <List.Content>{
                                        f.type === 'npc' ? f.reference : `User: ${f.reference}`
                                    }</List.Content>
                                </List.Item>
                            ))}
                    </List>
                </Grid.Column>
                <Grid.Column><Header size={'tiny'}>Players</Header>
                    <List>
                        {encounter.features
                            .filter(f => f.type === 'player')
                            .map((f, index) => (
                                <List.Item key={index}>
                                    <List.Icon
                                        link
                                        name='close'
                                        onClick={onRemove(f)}
                                    />
                                    <List.Content>{
                                        f.type === 'npc' ? f.reference : `User: ${f.reference}`
                                    }</List.Content>
                                </List.Item>
                            ))}
                    </List>
                </Grid.Column>
            </Grid>
        </>
    ) : null;
});
