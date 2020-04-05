import React, {FC} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../../Layout';
import {Encounter} from '../../../../server/model/encounter';
import {AddFeatures} from '../AddFeatures';
import {observer} from 'mobx-react';
import {MakeAttack} from './GM/MakeAttack';
import {AllEntities} from './GM/AllEntitits';

export const EncounterGm: FC<{ encounter: Encounter }> = observer(({encounter}) => {
    if (!encounter.features)
        return null;

    return (
        <Layout>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Header>Run {encounter.name}</Header>
                            <AllEntities encounter={encounter}/>
                            <MakeAttack encounter={encounter}/>
                            <AddFeatures encounter={encounter}/>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
