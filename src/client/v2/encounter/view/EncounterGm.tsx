import React, {FC} from 'react';
import {Form, Header} from 'semantic-ui-react';
import {Layout} from '../../Layout';
import {Encounter} from '../../../../server/model/encounter';
import {AddFeatures} from '../AddFeatures';
import {observer} from 'mobx-react';
import {MakeAttack} from './GM/MakeAttack';
import {AllEntities} from './GM/AllEntitits';
import {DealDamage} from './GM/DealDamage';
import {AllLogs} from './GM/AllLogs';

export const EncounterGm: FC<{ encounter: Encounter }> = observer(({encounter}) => {
    if (!encounter.features)
        return null;

    return (
        <Layout>
            <Header>Run {encounter.name}</Header>
            <Form>
                <AllEntities encounter={encounter}/>
                <MakeAttack encounter={encounter}/>
                <AllLogs encounter={encounter}/>
                <AddFeatures encounter={encounter}/>

                <DealDamage encounter={encounter}/>
            </Form>
        </Layout>
    );
});
