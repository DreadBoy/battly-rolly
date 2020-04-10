import React, {FC} from 'react';
import {Form, Header} from 'semantic-ui-react';
import {Layout} from '../../Layout';
import {Encounter} from '../../../../server/model/encounter';
import {AddFeatures} from '../AddFeatures';
import {observer} from 'mobx-react';
import {AllEntities} from './GM/AllEntitits';
import {MakeAttack} from './GM/MakeAttack';
import {AllLogs} from './GM/AllLogs';
import {DealDamage} from './GM/DealDamage';
import {ResolveResult} from './GM/ResolveResult';

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

                <ResolveResult encounter={encounter}/>
                <DealDamage encounter={encounter}/>
            </Form>
        </Layout>
    );
});
