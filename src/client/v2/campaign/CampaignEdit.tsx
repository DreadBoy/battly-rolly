import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {Campaign} from '../../../server/model/campaign';
import {observer} from 'mobx-react';
import {useLoader} from '../helpers/Store';
import {LoadingFactory} from '../helpers/Loading';
import {useEditor} from '../hooks/use-editor';
import {Link, useRouteMatch} from 'react-router-dom';

const Editor = LoadingFactory<Campaign>();

export const CampaignEdit: FC = observer(() => {
    const {url, params: {id: urlId}} = useRouteMatch();
    const campaign = useLoader<Campaign>();
    const empty = useCallback(() => ({
        name: '',
    }), []);
    const {submit, id, FormButtons, textControl} = useEditor<Campaign>(campaign, 'campaign', empty);

    return (
        <Layout title={<Link to={url.replace(/\/campaign.*$/, '/campaign')}>Campaigns</Link>}>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>{urlId ? 'Edit' : 'Create'} campaign</Header>
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
