import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {Campaign} from '../../../server/model/campaign';
import {observer} from 'mobx-react';
import {useStore} from '../helpers/StoreProvider';
import {LoadingFactory} from '../helpers/Loading';
import {useEditor} from '../hooks/use-editor';

const Editor = LoadingFactory<Campaign>();

export const CampaignCreate: FC = observer(() => {
    const {campaign} = useStore();
    const empty = useCallback(() => ({
        name: '',
    }), []);
    const {submit, id, FormButtons, textControl} = useEditor<Campaign>(campaign, 'campaign', empty);

    return (
        <Layout title={'Campaigns'}>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Create campaign</Header>
                        <Editor
                            id={id}
                            store={campaign}
                            render={() => (
                                <Form onSubmit={submit}>
                                    <Form.Input
                                        label={'Campaign\'s name'}
                                        {...textControl('name')}
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
