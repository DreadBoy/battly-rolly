import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {Campaign} from '../../server/model/campaign';
import {observer} from 'mobx-react';
import {useLoader} from '../helpers/Store';
import {useEditor} from '../hooks/use-editor';
import {useRouteMatch} from 'react-router-dom';
import {AsyncSection} from '../helpers/AsyncSection';
import {Params} from '../helpers/params';

const Editor = AsyncSection<Campaign>();

export const CampaignEdit: FC = observer(() => {
    const {params: {campaignId}} = useRouteMatch<Params>();
    const campaign = useLoader<Campaign>();
    const empty = useCallback(() => ({
        name: '',
    }), []);
    const {submit, id, FormButtons, textControl, mode} = useEditor<Campaign>(campaign, 'campaign', campaignId, empty);

    return (
        <Layout>
            <Grid doubling columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>{mode[0].toUpperCase() + mode.slice(1)} campaign</Header>
                        <Editor
                            id={id}
                            store={campaign}
                            render={() => (
                                <Form onSubmit={submit}>
                                    <Form.Input
                                        label={'Campaign\'s name'}
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
