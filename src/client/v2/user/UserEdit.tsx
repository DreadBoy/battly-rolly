import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {observer} from 'mobx-react';
import {useStore} from '../helpers/StoreProvider';
import {LoadingFactory} from '../helpers/Loading';
import {useEditor} from '../hooks/use-editor';
import {User} from '../../../server/model/user';

const Editor = LoadingFactory<User>();

export const UserEdit: FC = observer(() => {
    const {user} = useStore();
    const empty = useCallback(() => ({
        name: '',
    }), []);
    const {submit, id, FormButtons, textControl} = useEditor<User>(user, 'user', empty);

    return (
        <Layout title={'User'}>
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
                                        label={'Character\'s name'}
                                        {...textControl('name')}
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
