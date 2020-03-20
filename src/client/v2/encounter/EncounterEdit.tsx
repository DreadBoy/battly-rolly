import React, {FC, useCallback} from 'react';
import {Form, Grid, Header, List} from 'semantic-ui-react';
import {Layout} from '../Layout';
import {observer} from 'mobx-react';
import {LoadingFactory} from '../helpers/Loading';
import {useEditor} from '../hooks/use-editor';
import {useLoader} from '../helpers/Store';
import {Encounter} from '../../../server/model/encounter';
import {useRouteMatch} from 'react-router-dom';
import {MonsterList} from './MonsterList';
import {Feature} from '../../../server/model/feature';
import {MonsterParser} from './MonsterParser';

const Editor = LoadingFactory<Encounter>();

export const EncounterEdit: FC = observer(() => {
    const {params: {campaignId, encounterId}} = useRouteMatch();

    const encounter = useLoader<Encounter>();
    const empty = useCallback((): Partial<Encounter> => ({
        name: '',
    }), []);
    const {editor, submit, id, FormButtons, textControl, mode} = useEditor<Encounter>(
        encounter,
        'encounter',
        encounterId,
        empty,
        {post: `campaign/${campaignId}/encounter/`},
    );

    const onAdd = useCallback((features: Partial<Feature>[]) => {
        editor.features = editor.features || [];
        editor.features.push(...features as Feature[]);
    }, [editor.features]);

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
                                    <Grid columns={2}>
                                        <Grid.Column>
                                            <MonsterList onAdd={onAdd}/>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <MonsterParser onParsed={onAdd}/>
                                        </Grid.Column>
                                    </Grid>
                                    {(editor.features?.length ?? 0) > 0 && (
                                        <>
                                            <Header size={'tiny'}>Monsters</Header>
                                            <List>
                                                {editor.features?.map((f, index) => (
                                                    <List.Item key={index}>{f.reference}</List.Item>
                                                ))}
                                            </List>
                                        </>
                                    )}
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
