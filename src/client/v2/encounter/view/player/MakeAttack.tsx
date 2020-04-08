import React, {FC, useCallback} from 'react';
import {Button, Checkbox, CheckboxProps, Dropdown, Form, Grid, Header, List} from 'semantic-ui-react';
import {Feature} from '../../../../../server/model/feature';
import {observer, useLocalStore} from 'mobx-react';
import {StartLog} from '../../../../../server/service/log';
import {assign, filter, includes, isEmpty, pull} from 'lodash';
import {Encounter} from '../../../../../server/model/encounter';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Stacktrace} from '../../../helpers/Stacktrace';
import {onDropdown, onNumber, onText} from '../../../hooks/use-form';
import {abilities} from '../../../../common/encounter';
import {LogType} from '../../../../../server/model/log';

type Props = {
    encounter: Encounter,
}

export const MakeAttack: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();

    const empty = useCallback(() => ({
        source: [],
        target: [],
        type: 'direct',
        name: '',
    } as StartLog), []);
    const logSetup = useLocalStore<StartLog>(empty);

    const setType = useCallback((type: LogType) => () => {
        logSetup.type = type;
        if (type === 'direct') {
            logSetup.target.splice(0, logSetup.target.length - 1);
            assign(logSetup, {
                stat: undefined,
                DC: undefined,
            } as Partial<StartLog>);
        } else
            assign(logSetup, {
                attack: undefined,
            } as Partial<StartLog>);
    }, [logSetup]);

    const onChecked = useCallback((f: Feature) =>
        (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
            if (!data.checked) {
                pull(logSetup.target, f.id);
            } else if (logSetup.type === 'aoe') {
                logSetup.target.push(f.id);
            } else {
                logSetup.target.splice(0, logSetup.target.length, f.id);
            }
        }, [logSetup]);

    const isSetupValid = !isEmpty(logSetup.name) && !isEmpty(logSetup.target);

    const _confirm = useLoader();
    const onConfirm = useCallback(() => {
        _confirm.fetchAsync(api.post(`/log/encounter/${encounter.id}`, logSetup), encounter.id)
            .then(() => assign(logSetup, empty()))
            .catch(e => e);
    }, [_confirm, api, empty, encounter.id, logSetup]);


    const monsters = filter(encounter.features, ['type', 'npc']);
    const players = filter(encounter.features, ['type', 'player']);
    return (
        <Form onSubmit={onConfirm}>
            <Grid>
                <Grid.Column width={16}>
                    <Header size={'small'}>Make an attack</Header>
                    <Form.Input
                        label={'Name'}
                        onChange={onText(logSetup, 'name')}
                        value={logSetup.name}
                    />
                    <Form.Field>
                        <label>Attack type</label>
                        <Button.Group>
                            <Button
                                type={'button'}
                                basic
                                primary={logSetup.type === 'direct'}
                                onClick={setType('direct')}
                            >Direct</Button>
                            <Button
                                type={'button'}
                                basic
                                primary={logSetup.type === 'aoe'}
                                onClick={setType('aoe')}
                            >AoE</Button>
                        </Button.Group>
                    </Form.Field>
                    {logSetup.type === 'direct' ? (
                        <Form.Input
                            label={'Attack roll'}
                            onChange={onNumber(logSetup, 'attack')}
                            type={'number'}
                            value={logSetup.attack}
                        />
                    ) : (
                        <>
                            <Form.Field>
                                <label>Ability</label>
                                <Dropdown
                                    selection
                                    options={abilities.map(t => ({
                                        key: t, value: t, text: t,
                                    }))}
                                    value={logSetup.stat}
                                    onChange={onDropdown(logSetup, 'stat')}
                                />
                            </Form.Field>
                            <Form.Input
                                label={'DC'}
                                onChange={onText(logSetup, 'DC')}
                                type={'number'}
                                value={logSetup.DC}
                            />
                        </>
                    )}
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header size={'tiny'}>Monsters</Header>
                    {!isEmpty(monsters) && (
                        <List>
                            {monsters.map(f => (
                                <List.Item key={f.id}>
                                    <Checkbox
                                        label={f.reference}
                                        onChange={onChecked(f)}
                                        checked={includes(logSetup.target, f.id)}
                                    />
                                </List.Item>
                            ))}
                        </List>
                    )}
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header size={'tiny'}>Players</Header>
                    {!isEmpty(players) && (
                        <List>
                            {players.map(f => (
                                <List.Item key={f.id}>
                                    <Checkbox
                                        label={`User: ${f.reference}`}
                                        onChange={onChecked(f)}
                                        checked={includes(logSetup.target, f.id)}
                                    />
                                </List.Item>
                            ))}
                        </List>
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    <Button
                        basic
                        primary
                        disabled={!isSetupValid}
                        type={'submit'}
                        loading={_confirm.loading[encounter.id]}
                    >Make attack!</Button>
                    <Stacktrace error={_confirm.error[encounter.id]}/>
                </Grid.Column>
            </Grid>
        </Form>
    );
});
