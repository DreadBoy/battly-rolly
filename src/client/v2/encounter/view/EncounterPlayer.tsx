import React, {FC} from 'react';
import {Grid, Header} from 'semantic-ui-react';
import {Layout} from '../../Layout';
import {Encounter} from '../../../../server/model/encounter';
import {observer} from 'mobx-react';
import {MakeAttack} from './player/MakeAttack';

export const EncounterPlayer: FC<{ encounter: Encounter }> = observer(({encounter}) => {
    if (!encounter.features)
        return null;

    return (
        <Layout>
            <Grid>
                <Grid.Column size={16}>
                    <Header>Oh no, it's {encounter.name}!</Header>
                    <MakeAttack encounter={encounter}/>
                </Grid.Column>
            </Grid>
        </Layout>
    );
});
