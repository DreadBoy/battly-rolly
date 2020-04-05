import React, {FC, useCallback} from 'react';
import {useLoader} from '../helpers/Store';
import {Feature} from '../../../server/model/feature';
import {usePlayerId} from '../helpers/PlayerId';
import {Encounter} from '../../../server/model/encounter';
import {Grid, Header} from 'semantic-ui-react';
import {MonsterList} from './MonsterList';
import {MonsterParser} from './MonsterParser';
import {Stacktrace} from '../helpers/Stacktrace';
import {useBackend} from '../helpers/BackendProvider';

type Props = {
    encounter: Encounter,
}

export const AddFeatures: FC<Props> = ({encounter}) => {
    const {id: playerId} = usePlayerId();
    const {api} = useBackend();

    const silentLoader = useLoader();
    const onAdd = useCallback((features: Partial<Feature>[]) => {
        silentLoader.fetch(api.post(`/encounter/${encounter.id}/feature`, {features}), 'add');
    }, [api, encounter.id, silentLoader]);

    return encounter && encounter.campaign.gm.id === playerId ? (
        <>
            <Header size={'small'}>Add entities</Header>
            <Grid columns={2}>
                <Grid.Column>
                    <MonsterList onAdd={onAdd}/>
                </Grid.Column>
                <Grid.Column>
                    <MonsterParser onParsed={onAdd}/>
                </Grid.Column>
                <Grid.Column>
                    <Stacktrace
                        error={silentLoader.error['add'] || silentLoader.error['remove']}
                    />
                </Grid.Column>
            </Grid>
        </>
    ) : null;
};
