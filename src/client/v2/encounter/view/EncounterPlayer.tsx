import React, {FC} from 'react';
import {Form, Grid, Header, List} from 'semantic-ui-react';
import {Layout} from '../../Layout';
import {Encounter} from '../../../../server/model/encounter';
import {observer} from 'mobx-react';

export const EncounterPlayer: FC<{ encounter: Encounter }> = observer(({encounter}) => {
    if (!encounter.features)
        return null;
    return (
        <Layout>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Header>Oh no, it's {encounter.name}!</Header>
                            {encounter.features.length > 0 && (
                                <>
                                    <Header size={'tiny'}>Monsters</Header>
                                    <List>
                                        {encounter.features.map((f, index) => (
                                            <List.Item key={index}>{f.reference}</List.Item>
                                        ))}
                                    </List>
                                </>
                            )}
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});