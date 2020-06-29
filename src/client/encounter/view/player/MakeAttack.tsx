import React, {FC, useCallback} from 'react';
import {Button, Checkbox, CheckboxProps, Dropdown, Form, Grid, Header, Icon, List} from 'semantic-ui-react';
import {Feature} from '../../../../server/model/feature';
import {observer, useLocalStore} from 'mobx-react';
import {StartLog} from '../../../../server/service/log';
import {assign, filter, find, includes, isEmpty, map, pull} from 'lodash';
import {Encounter} from '../../../../server/model/encounter';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Stacktrace} from '../../../elements/Stacktrace';
import {onDropdown, onNumber, onText} from '../../../hooks/use-form';
import {LogType} from '../../../../server/model/log';
import {usePlayerId} from '../../../helpers/PlayerId';
import {createUseStyles} from 'react-jss';
import classNames from 'classnames';
import {featureToDisplay} from '../../../helpers/display-helpers';
import {hasPlayer, type} from '../../../../server/model/helpers';
import {abilities} from '../../../../server/encounter';

type Props = {
    encounter: Encounter,
}

const useStyles = createUseStyles({
    strike: {
        textDecoration: 'line-through',
    },
});

export const MakeAttack: FC<Props> = observer(({encounter}) => {
    const classes = useStyles();
    const {api} = useBackend();
    const {id: playerId} = usePlayerId();
    const playerFeature = find(encounter.features, hasPlayer(playerId));

    const empty = useCallback(() => ({
        source: [playerFeature?.id],
        target: [],
        type: 'direct',
        name: '',
        attack: undefined,
        stat: 'constitution',
        DC: undefined,
    } as StartLog), [playerFeature]);
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


    const monsters = filter(encounter.features, f => type(f) === 'npc');
    const players = filter(encounter.features, f => type(f) === 'player');
    return (
        <Form onSubmit={onConfirm}>
            <Grid>
                <Grid.Column width={16}>
                    <Header size={'small'}>Make an attack</Header>
                    <Form.Input
                        name={'name_of_attack'}
                        label={'Name of attack'}
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
                            value={logSetup.attack || ''}
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
                    <Header sub>Monsters</Header>
                    {!isEmpty(monsters) && (
                        <List>
                            {map(monsters, f => (
                                <List.Item key={f.id}>
                                    <Checkbox
                                        onChange={onChecked(f)}
                                        checked={includes(logSetup.target, f.id)}
                                        label={(
                                            <label className={classNames({[classes.strike]: f.HP <= 0})}>
                                                {featureToDisplay(f)}
                                                {f.HP > 0 && f.HP <= f.initialHP / 2 && (
                                                    <Icon name={'tint'} color={'red'}/>
                                                )}
                                            </label>
                                        )}
                                    />


                                </List.Item>
                            ))}
                        </List>
                    )}
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header sub>Players</Header>
                    {!isEmpty(players) && (
                        <List>
                            {map(players, f => (
                                <List.Item key={f.id}>
                                    <Checkbox
                                        label={featureToDisplay(f)}
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
