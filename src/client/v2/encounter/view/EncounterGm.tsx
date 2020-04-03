import React, {FC, useCallback} from 'react';
import {Form, Grid, Header, List} from 'semantic-ui-react';
import {Layout} from '../../Layout';
import {Encounter} from '../../../../server/model/encounter';
import {AddFeatures} from '../AddFeatures';
import {observer} from 'mobx-react';
import {Feature} from '../../../../server/model/feature';
import {useLoader} from '../../helpers/Store';
import {useBackend} from '../../helpers/BackendProvider';

export const EncounterGm: FC<{ encounter: Encounter }> = observer(({encounter}) => {
    const silentLoader = useLoader();
    const {api} = useBackend();

    const onRemove = useCallback((feature: Partial<Feature>) => () => {
        silentLoader.fetch(api.delete(`/encounter/${encounter.id}/feature`, {data: {features: [feature]}}), 'remove');
    }, [api, encounter.id, silentLoader]);

    if (!encounter.features)
        return null;

    return (
        <Layout>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Header>Run {encounter.name}</Header>
                            {encounter.features.length > 0 && (
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
                                                        <List.Content>{f.reference}</List.Content>
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
                                                        <List.Content>{f.reference}</List.Content>
                                                    </List.Item>
                                                ))}
                                        </List>
                                    </Grid.Column>
                                </Grid>
                            )}
                            <AddFeatures encounter={encounter}/>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
