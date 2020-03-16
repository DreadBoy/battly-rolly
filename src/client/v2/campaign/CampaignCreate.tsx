import React, {FC, useCallback, useEffect} from 'react';
import {Button, Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {useBackend} from '../helpers/BackendProvider';
import {Campaign} from '../../../server/model/campaign';
import {observer, useLocalStore} from 'mobx-react';
import {useStore} from '../helpers/StoreProvider';
import {toJS} from 'mobx';
import {useHistory, useRouteMatch} from 'react-router';
import {assign} from 'lodash';
import {Store} from '../helpers/Store';
import {LoadingFactory} from '../helpers/Loading';

const Editor = LoadingFactory<Campaign>();

export const CampaignCreate: FC = observer(() => {
    const {api} = useBackend();
    const {goBack} = useHistory();
    const {params: {id}} = useRouteMatch();
    const fakeId = 'campaign';

    const empty = useCallback(() => ({
        name: '',
    }), []);
    const editor = useLocalStore<Partial<Campaign>>(empty);

    const editorDefault = useLocalStore<Partial<Campaign>>(empty);
    const {campaign} = useStore();
    useEffect(() => {
        const promise = id ?
            campaign.fetchAsync(api.get(`/campaign/${id}`), id) :
            campaign.fetchAsync(Store.empty<Campaign>(empty), fakeId);
        promise.then((data) => {
            assign(editorDefault, data);
            assign(editor, data);
        });
    }, [api, campaign, editor, editorDefault, empty, id]);

    const {noContent} = useStore();
    const reset = useCallback(() => {
        assign(editor, editorDefault);
    }, [editor, editorDefault]);
    const submit = useCallback(() => {
        const promise = id ?
            noContent
                .fetchAsync(api.put(`/campaign/${id}`, toJS(editor)), id) :
            noContent
                .fetchAsync(api.post('/campaign', toJS(editor)), fakeId);
        promise.then(goBack);
    }, [api, editor, goBack, id, noContent]);

    return (
        <Layout title={'Campaigns'}>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Create campaign</Header>
                        <Editor
                            id={id || fakeId}
                            store={campaign}
                            render={() => (
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
                                            onClick={reset}
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
                            )}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
