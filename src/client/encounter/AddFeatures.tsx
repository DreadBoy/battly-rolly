import React, {FC, useCallback} from 'react';
import {useLoader} from '../helpers/Store';
import {usePlayerId} from '../helpers/PlayerId';
import {Encounter} from '../../server/model/encounter';
import {Grid, Header} from 'semantic-ui-react';
import {SearchMonsters} from './SearchMonsters';
import {Stacktrace} from '../elements/Stacktrace';
import {useBackend} from '../helpers/BackendProvider';
import {AddFeature} from '../../server/repo/feature';
import {roll} from '../helpers/roll';
import {Monster} from '../../server/model/monster';

type Props = {
    encounter: Encounter,
}

export const AddFeatures: FC<Props> = ({encounter}) => {
    const {id: playerId} = usePlayerId();
    const {api} = useBackend();

    const silentLoader = useLoader();
    const onAdd = useCallback((monster: Monster) => {
        const HP = roll(monster.HP);
        const feature: AddFeature = {
            type: 'npc',
            reference: monster.id,
            AC: monster.AC,
            HP,
            initialHP: HP,
        };
        silentLoader.fetch(api.post(`/encounter/${encounter.id}/feature`, {features: [feature]}), 'add');
    }, [api, encounter.id, silentLoader]);

    return encounter && encounter.campaign.gm.id === playerId ? (
        <>
            <Header size={'small'}>Add entities</Header>
            <Grid columns={2}>
                <Grid.Column>
                    <SearchMonsters onSelect={onAdd}/>
                </Grid.Column>
                <Grid.Column>
                    <Stacktrace error={silentLoader.error['add']}/>
                </Grid.Column>
            </Grid>
        </>
    ) : null;
};
