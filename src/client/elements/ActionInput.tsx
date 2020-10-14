import React, {FC, useCallback} from 'react';
import {
    Button,
    Checkbox,
    Dropdown,
    DropdownProps,
    Form,
    Input,
    InputOnChangeData,
    InputProps,
    Segment,
} from 'semantic-ui-react';
import {Action} from '../../server/model/action';
import {assign, isEmpty} from 'lodash';
import {RollInput} from './RollInput';
import {abilities, actionTypes, Damage, Roll, statuses} from '../../server/model/action-types';
import {DamageInput} from './DamageInput';
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import {integer} from '../helpers/integer';

type Props = Pick<InputProps, 'id' | 'label' | 'required'> & {
    action: Action,
    onChange: (set: Action) => void,
    onRemove: () => void,
}

export const ActionInput: FC<Props> = ({action, onChange, onRemove, required, id, label}) => {
    id = `${id}-action`;
    label = isEmpty(label) ? 'New action' : label;

    const onDropdown = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        onChange(assign({}, action, {
            type: data.value,
        } as Action));
    }, [action, onChange]);
    const onAbility = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        onChange(assign({}, action, {
            ability: data.value,
        } as Action));
    }, [action, onChange]);
    const onStatus = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        onChange(assign({}, action, {
            status: data.value ? data.value : undefined,
        } as Action));
    }, [action, onChange]);

    const onName = useCallback((event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        onChange(assign({}, action, {
            name: data.value,
        } as Action));
    }, [action, onChange]);

    const onModifier = useCallback((roll: Roll) => {
        onChange(assign({}, action, {
            modifier: roll[2],
        } as Action));
    }, [action, onChange]);

    const onDamage = useCallback((damage: Damage | undefined) => {
        onChange(assign({}, action, {
            damage,
        } as Action));
    }, [action, onChange]);

    const onDC = useCallback((event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const num = parseFloat(data.value || '');
        if (!isNaN(num)) {
            onChange(assign({}, action, {
                DC: num,
            } as Action));
        }
    }, [action, onChange]);

    const onHalf = useCallback((event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        onChange(assign({}, action, {
            takeHalfOnFailure: data.checked,
        } as Action));
    }, [action, onChange]);

    return (
        <Form.Field required={required}>
            <label htmlFor={id}>{label}</label>
            <Segment>
                <Form.Field required={required}>
                    <label htmlFor={id}>Name</label>
                    <Input
                        id={id}
                        fluid
                        value={action.name}
                        onChange={onName}
                    />
                </Form.Field>
                <Form.Field
                    required={required}
                >
                    <label htmlFor={`${id}-type`}>Attack type</label>
                    <Dropdown
                        id={`${id}-type`}
                        search
                        selection
                        options={actionTypes.map(t => ({
                            key: t, value: t, text: t,
                        }))}
                        value={action.type}
                        onChange={onDropdown}
                    />
                </Form.Field>
                {action.type === 'direct' ? (
                    <>
                        <Form.Field
                            label={'Attack roll'}
                            id={`${id}-attack_roll`}
                            control={RollInput}
                            value={[1, 20, action.modifier]}
                            onChange={onModifier}
                            required={required}
                        />
                        <DamageInput
                            label={'Damage'}
                            id={`${id}-damage`}
                            value={action.damage}
                            onChange={onDamage}
                            required={required}
                        />
                    </>
                ) : (
                    <>
                        <Form.Group widths={'equal'}>
                            <Form.Input
                                label={'DC'}
                                {...integer}
                                id={`${id}-dc`}
                                value={action.DC}
                                onChange={onDC}
                                required={required}
                            />
                            <Form.Field
                                required={required}>
                                <label htmlFor={`${id}-ability`}>Ability</label>
                                <Dropdown
                                    id={`${id}-dc`}
                                    search
                                    selection
                                    options={abilities.map(t => ({
                                        key: t, value: t, text: t,
                                    }))}
                                    value={action.ability}
                                    onChange={onAbility}
                                />
                            </Form.Field>
                        </Form.Group>
                        <DamageInput
                            label={'Damage'}
                            id={`${id}-damage`}
                            value={action.damage}
                            onChange={onDamage}
                            required={required}
                        />
                        <Form.Field>
                            <Checkbox
                                label='Targets take half damage on successful save'
                                checked={action.takeHalfOnFailure}
                                onChange={onHalf}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label htmlFor={`${id}-status`}>Status</label>
                            <Dropdown
                                id={`${id}-status`}
                                search
                                selection
                                options={[{
                                    key: 'no-effect',
                                    value: '',
                                    text: 'No status effect',
                                }].concat(...statuses.map(t => ({
                                    key: t, value: t, text: t,
                                })))}
                                value={action.status || ''}
                                onChange={onStatus}
                            />
                        </Form.Field>
                    </>
                )}
                <Button
                    type={'button'}
                    basic
                    primary
                    size={'mini'}
                    onClick={onRemove}
                >Remove</Button>
            </Segment>
        </Form.Field>
    );
};
