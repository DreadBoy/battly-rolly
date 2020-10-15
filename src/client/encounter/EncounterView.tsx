import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react';
import {useGlobalStore} from '../helpers/GlobalStore';
import {Encounter} from '../../server/model/encounter';
import {useRouteMatch} from 'react-router-dom';
import {useBackend} from '../helpers/BackendProvider';
import {isNil} from 'lodash';
import {usePlayerId} from '../helpers/PlayerId';
import {EncounterPlayer} from './view/EncounterPlayer';
import {EncounterGm} from './view/EncounterGm';
import {Loader} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {Params} from '../helpers/params';

export const EncounterView: FC = observer(() => {
    const {params: {encounterId}} = useRouteMatch<Params>();
    const {api} = useBackend();
    const {id: playerId} = usePlayerId();

    const encounter = useGlobalStore();
    useEffect(() => {
        encounter.fetch(api.get(`/encounter/${encounterId}`), encounterId);
    }, [api, encounter, encounterId]);

    return encounter.loading[encounterId] || isNil(encounter.data[encounterId]) ? (
        <Layout>
            <Loader active size='large' inline={'centered'}/>
        </Layout>
    ) : encounter.data[encounterId].campaign?.gm.id === playerId ? (
        <EncounterGm encounter={encounter.data[encounterId] as Encounter}/>
    ) : (
        <EncounterPlayer encounter={encounter.data[encounterId] as Encounter}/>
    );
});
