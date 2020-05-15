import React, {FC, useCallback} from 'react';
import {Form, Grid, Header} from 'semantic-ui-react';
import {Layout} from '../layout/Layout';
import {Monster} from '../../server/model/monster';
import {observer} from 'mobx-react';
import {useLoader} from '../helpers/Store';
import {useEditor} from '../hooks/use-editor';
import {useRouteMatch} from 'react-router-dom';
import {AsyncSection} from '../helpers/AsyncSection';
import {RollInput} from '../elements/RollInput';
import {AbilitySet, Roll} from '../../server/model/action-types';
import {AbilitySetInput} from '../elements/AbilitySetInput';
import {toJS} from 'mobx';

const Editor = AsyncSection<Monster>();

export const MonsterEdit: FC = observer(() => {
    const {params: {monsterId}} = useRouteMatch();
    const monster = useLoader<Monster>();
    const empty: () => Partial<Monster> = useCallback(() => ({
        name: '',
        HP: [0, 0, 0],
        AC: 0,
        abilitySet: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        },
        savingThrows: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
        },
    }), []);
    const {submit, id, FormButtons, textControl, numberControl, mode, editor} = useEditor<Monster>(monster, 'monster', monsterId, empty);

    const rollControl = useCallback((key: keyof Monster) => ({
        value: toJS(editor[key]) as Roll,
        onChange: (roll: Roll) => {
            // @ts-ignore
            editor[key] = roll;
        },
    }), [editor]);

    const abilitySetControl = useCallback((key: keyof Monster) => ({
        value: toJS(editor[key]) as AbilitySet,
        onChange: (set: AbilitySet) => {
            // @ts-ignore
            editor[key] = set;
            console.log(set);
        },
    }), [editor]);

    return (
        <Layout>
            <Grid doubling columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Header>{mode[0].toUpperCase() + mode.slice(1)} monster</Header>
                        <Editor
                            id={id}
                            store={monster}
                            render={() => (
                                <Form onSubmit={submit}>
                                    <Form.Input
                                        label={'Name'}
                                        id={'name'}
                                        {...textControl('name')}
                                        required
                                    />
                                    <Form.Field
                                        label={'HP'}
                                        id={'HP'}
                                        control={RollInput}
                                        {...rollControl('HP')}
                                        required
                                    />
                                    <Form.Input
                                        label={'AC'}
                                        id={'AC'}
                                        type={'number'}
                                        {...numberControl('AC')}
                                        required
                                    />
                                    <AbilitySetInput
                                        label={'Stats'}
                                        id={'stats'}
                                        {...abilitySetControl('abilitySet')}
                                        required
                                    />
                                    <AbilitySetInput
                                        label={'Saving throws'}
                                        id={'throws'}
                                        {...abilitySetControl('savingThrows')}
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
