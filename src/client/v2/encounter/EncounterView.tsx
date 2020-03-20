import React, {FC, useEffect} from 'react';
import {Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {observer} from 'mobx-react';
import {LoadingFactory} from '../helpers/Loading';
import {useLoader} from '../helpers/Store';
import {Encounter} from '../../../server/model/encounter';
import {useRouteMatch} from 'react-router-dom';
import {useBackend} from '../helpers/BackendProvider';

const Editor = LoadingFactory<Encounter>();

export const EncounterView: FC = observer(() => {
    const {params: {encounterId}} = useRouteMatch();
    const {api} = useBackend();

    const encounter = useLoader<Encounter>();
    useEffect(() => {
        encounter.fetch(api.get(`/encounter/${encounterId}`), encounterId);
    }, [api, encounter, encounterId]);

    return (
        <Layout>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Run encounter</Header>

                        <Editor
                            id={encounterId}
                            store={encounter}
                            render={(data) => (
                                <Header size={'tiny'}>{data.name}</Header>
                            )}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
