import React, {FC, useCallback} from 'react';
import {
    Button,
    ButtonGroup,
    Checkbox,
    CheckboxProps,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    List,
} from 'semantic-ui-react';
import {Feature} from '../../../../server/model/feature';
import {observer, useLocalStore} from 'mobx-react';
import {StartLog} from '../../../../server/service/log';
import {assign, filter, find, includes, isEmpty, isNil, map, pick, pull, sortBy, uniqBy} from 'lodash';
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
import {integer} from '../../../helpers/integer';
import {useLocalStorage} from '../../../hooks/use-local-storage';
import {toJS} from 'mobx';
import {ConfirmButton} from '../../../elements/ConfirmButton';

type Props = {
    encounter: Encounter,
}

const useStyles = createUseStyles({
    strike: {
        textDecoration: 'line-through',
    },
    checkbox: {
        alignSelf: 'center',
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
        nat20: undefined,
        stat: 'constitution',
        DC: undefined,
    } as StartLog), [playerFeature]);
    const logSetup = useLocalStore<StartLog>(empty);

    const {value, remove, set} = useLocalStorage('saved-attacks');
    const savedAttacks: StartLog[] = isNil(value) ? [] : JSON.parse(value);

    const loadAttack = useCallback((log: StartLog) => () => {
        assign(logSetup, empty());
        assign(logSetup, log);
    }, [empty, logSetup]);

    const saveAttack = useCallback(() => {
        const setup = pick(toJS(logSetup), 'name', 'type', 'stat', 'DC', 'target') as StartLog;
        // uniqBy will take first duplicated element, that's reason why we put new setup in first place
        // We always wish to overwrite saved attack with new one
        const newValue = uniqBy([setup, ...savedAttacks], 'name');
        set(JSON.stringify(newValue));
    }, [logSetup, savedAttacks, set]);

    const clearAttacks = useCallback(remove, [remove]);

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

    const onNat20 = useCallback((event: React.FormEvent<HTMLInputElement>, {checked}: CheckboxProps) => {
        if (checked) {
            logSetup.nat20 = true;
        } else
            logSetup.nat20 = undefined;
    }, [logSetup.nat20]);

    const isSetupValid = !isEmpty(logSetup.name) && !isEmpty(logSetup.target);

    const _confirm = useLoader();
    const onConfirm = useCallback(() => {
        saveAttack();
        _confirm.fetchAsync(api.post(`/log/encounter/${encounter.id}`, logSetup), encounter.id)
            .then(() => assign(logSetup, empty()))
            .catch(e => e);
    }, [_confirm, api, empty, encounter.id, logSetup, saveAttack]);


    const monsters = filter(encounter.features, f => type(f) === 'npc');
    const players = filter(encounter.features, f => type(f) === 'player');
    return (
        <Form onSubmit={onConfirm}>
            <Grid>
                <Grid.Column width={16}>
                    <Header size={'small'}>Make an attack</Header>
                    {!isEmpty(savedAttacks) && (
                        <Form.Field>
                            <label>Previous attacks</label>
                            <ButtonGroup size={'tiny'} basic>
                                {savedAttacks.map(a => (
                                    <Button
                                        key={a.name}
                                        type={'button'}
                                        color={'grey'}
                                        onClick={loadAttack(a)}>
                                        {a.name}
                                    </Button>
                                ))}
                                <ConfirmButton
                                    color={'grey'}
                                    onClick={clearAttacks}>
                                    Forget all attacks
                                </ConfirmButton>
                            </ButtonGroup>
                        </Form.Field>
                    )}
                    <Form.Input
                        name={'name_of_attack'}
                        label={'Name of attack'}
                        onChange={onText(logSetup, 'name')}
                        value={logSetup.name}
                        required
                    />
                    <Form.Field required>
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
                        <Form.Group>
                            <Form.Input
                                label={'Attack roll'}
                                {...integer}
                                onChange={onNumber(logSetup, 'attack')}
                                value={logSetup.attack || ''}
                                required
                                disabled={logSetup.nat20}
                            />
                            <Form.Field className={classes.checkbox}>
                                <Checkbox
                                    label={'Nat 20'}
                                    onChange={onNat20}
                                    checked={!!logSetup.nat20}
                                />
                            </Form.Field>
                        </Form.Group>
                    ) : (
                        <>
                            <Form.Field required>
                                <label>Ability</label>
                                <Dropdown
                                    search
                                    selection
                                    options={abilities.map(t => ({
                                        key: t, value: t, text: t,
                                    }))}
                                    value={logSetup.stat}
                                    onChange={onDropdown(logSetup, 'stat')}
                                />
                            </Form.Field>
                            <Form.Input
                                required
                                label={'DC'}
                                onChange={onText(logSetup, 'DC')}
                                {...integer}
                                value={logSetup.DC}
                            />
                        </>
                    )}
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header sub>Monsters</Header>
                    {!isEmpty(monsters) && (
                        <List>
                            {map(
                                sortBy(monsters, 'createdAt'),
                                f => (
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
                                ),
                            )}
                        </List>
                    )}
                </Grid.Column>
                <Grid.Column width={8}>
                    <Header sub>Players</Header>
                    {!isEmpty(players) && (
                        <List>
                            {map(
                                sortBy(players, 'createdAt'),
                                f => (
                                    <List.Item key={f.id}>
                                        <Checkbox
                                            label={featureToDisplay(f)}
                                            onChange={onChecked(f)}
                                            checked={includes(logSetup.target, f.id)}
                                        />
                                    </List.Item>
                                ),
                            )}
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
