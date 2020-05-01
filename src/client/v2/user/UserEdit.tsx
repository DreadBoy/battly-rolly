import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {observer} from 'mobx-react';
import {useLoader} from '../helpers/Store';
import {LoadingFactory} from '../helpers/Loading';
import {useEditor} from '../hooks/use-editor';
import {User} from '../../../server/model/user';
import {useRouteMatch} from 'react-router';

const Editor = LoadingFactory<User>();

export const UserEdit: FC = observer(() => {
    const {params: {userId}} = useRouteMatch();
    const user = useLoader<User>();
    const empty = useCallback(() => ({
        displayName: '',
    }), []);
    const {submit, id, FormButtons, textControl} = useEditor<User>(user, 'user', userId, empty);

    return (
        <Layout>
            <Grid doubling columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>Edit your info</Header>
                        <Editor
                            id={id}
                            store={user}
                            render={() => (
                                <Form onSubmit={submit}>
                                    <Form.Input
                                        label={'Display name'}
                                        {...textControl('displayName')}
                                        required
                                    />
                                    <FormButtons removeButton={false}/>
                                </Form>
                            )}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
});
