import React, {FC, useCallback} from 'react';
import {Button, Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {useBackend} from '../helpers/BackendProvider';
import {Campaign} from '../../../server/model/campaign';
import {observer, useLocalStore} from 'mobx-react';
import {useStore} from '../helpers/StoreProvider';
import {toJS} from 'mobx';
import {useHistory} from 'react-router';
import {assign} from 'lodash';

export const CampaignCreate: FC = observer(() => {
    const {api} = useBackend();
    const {goBack} = useHistory();
    const id = 'campaign';
    const reset = useCallback(() => ({
        name: '',
    }), []);
    const editor = useLocalStore<Partial<Campaign>>(reset);
    const {noContent} = useStore();
    const submit = useCallback(() => {
        noContent
            .fetchAsync(api.post('/campaign', toJS(editor)), id)
            .then(goBack);
    }, [api, editor, goBack, noContent]);

    return (
        <Layout title={'Campaigns'}>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Create campaign</Header>
                        <Form onSubmit={submit}>
                            <Form.Input
                                label={'Campaign\'s name'}
                                value={editor.name}
                                onChange={(event => editor.name = event.target.value)}
                            />
                            <Button.Group>
                                <Button
                                    basic
                                    color={'red'}
                                    type='reset'
                                    onClick={() => assign(editor, reset())}
                                >Reset</Button>
                                <Button
                                    basic
                                    color={'blue'}
                                    type='submit'
                                    loading={noContent.loading[id]}
                                    disabled={noContent.loading[id]}
                                >Submit</Button>
                            </Button.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
