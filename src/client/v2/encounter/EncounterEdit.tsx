import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {observer} from 'mobx-react';
import {LoadingFactory} from '../helpers/Loading';
import {useEditor} from '../hooks/use-editor';
import {Link, useRouteMatch} from 'react-router-dom';
import {useLoader} from '../helpers/Store';
import {Encounter} from '../../../server/model/encounter';

const Editor = LoadingFactory<Encounter>();

export const EncounterEdit: FC = observer(() => {
    const {url} = useRouteMatch();
    const encounter = useLoader<Encounter>();
    const empty = useCallback((): Partial<Encounter> => ({
    }), []);

    const {submit, id, FormButtons} = useEditor<Encounter>(encounter, 'encounter', empty);
    const upUrl = encounter.data[id] ? url.replace(/\/encounter.*$/, `/campaign/${encounter.data[id].campaign.id}`) : url;

    return (
        <Layout title={<Link to={upUrl}>Campaign</Link>}>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Edit encounter</Header>
                        <Editor
                            id={id}
                            store={encounter}
                            render={() => (
                                <Form onSubmit={submit}>
                                    <FormButtons/>
                                </Form>
                            )}
                        />

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
