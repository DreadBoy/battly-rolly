import React, {FC, useCallback, useEffect} from 'react';
import {observer, useLocalStore} from 'mobx-react';
import {useLoader} from '../helpers/Store';
import {Encounter} from '../../../server/model/encounter';
import {useRouteMatch} from 'react-router-dom';
import {useBackend} from '../helpers/BackendProvider';
import {assign} from 'lodash';
import {usePlayerId} from '../helpers/PlayerId';
import {EncounterPlayer} from './view/EncounterPlayer';
import {EncounterGm} from './view/EncounterGm';
import {Loader} from 'semantic-ui-react';
import {Layout} from '../Layout';

export const EncounterView: FC = observer(() => {
    const {params: {encounterId}} = useRouteMatch();
    const {api, socket} = useBackend();
    const {id: playerId} = usePlayerId();

    const empty = useCallback((): Partial<Encounter> => ({
        name: '',
    }), []);
    const editor = useLocalStore<Partial<Encounter>>(empty);

    const encounter = useLoader<Encounter>();
    useEffect(() => {
        encounter.fetchAsync(api.get(`/encounter/${encounterId}`), encounterId)
            .then(data => {
                assign(editor, data);
            });
    }, [api, editor, encounter, encounterId]);

    useEffect(() => {
        const onEncounter = (state: string) => {
            const encounter = JSON.parse(state) as Encounter;
            assign(editor, encounter);
        };
        socket?.addEventListener('encounter', onEncounter);
        return () => {
            socket?.removeEventListener('encounter', onEncounter);
        };
    }, [editor, socket]);

    return encounter.loading[encounterId] ? (
        <Layout>
            <Loader active size='large' inline={'centered'}/>
        </Layout>
    ) : editor.campaign?.gm.id === playerId ? (
        <EncounterGm encounter={editor as Encounter}/>
    ) : (
        <EncounterPlayer encounter={editor as Encounter}/>
    );
});
