import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {observer} from 'mobx-react';
import {useEditor} from '../hooks/use-editor';
import {useLoader} from '../helpers/Store';
import {Encounter} from '../../server/model/encounter';
import {useRouteMatch} from 'react-router-dom';
import {AsyncSection} from '../helpers/AsyncSection';
import {Params} from '../helpers/params';

const Editor = AsyncSection<Encounter>();

export const EncounterEdit: FC = observer(() => {
    const {params: {campaignId, encounterId}} = useRouteMatch<Params>();

    const encounter = useLoader<Encounter>();
    const empty = useCallback((): Partial<Encounter> => ({
        name: '',
    }), []);
    const {submit, id, FormButtons, textControl, mode} = useEditor<Encounter>(
        encounter,
        'encounter',
        encounterId,
        empty,
        {post: `campaign/${campaignId}/encounter/`},
    );

    return (
        <Layout>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>{mode[0].toUpperCase() + mode.slice(1)} encounter</Header>
                        <Editor
                            id={id}
                            store={encounter}
                            render={() => (
                                <Form onSubmit={submit}>
                                    <Form.Input
                                        label={'Encounter\'s name'}
                                        {...textControl('name')}
                                        required
                                    />
                                    <FormButtons removeButton={mode === 'edit'}/>
                                </Form>
                            )}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
