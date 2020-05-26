import {Damage, Roll} from '../../server/model/action-types';
import React, {FC, useCallback} from 'react';
import {Checkbox, Dropdown, Form, InputProps} from 'semantic-ui-react';
import {damageTypes} from '../../server/encounter';
import {RollInput} from './RollInput';
import {assign, isNil, cloneDeep} from 'lodash';
import {DropdownProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';

type Props = Pick<InputProps, 'id' | 'label' | 'required'> & {
    value: Damage | undefined,
    onChange: (damage: Damage | undefined) => void
}

export const defaultDamage: Damage = {
    roll: [1, 20, 0],
    damageType: 'bludgeoning',
};

export const DamageInput: FC<Props> = ({id, label, required, value, onChange}) => {

    const onChecked = useCallback((event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        if (data.checked)
            onChange(undefined);
        else
            onChange(cloneDeep(defaultDamage));
    }, [onChange]);

    const onRoll = useCallback((roll: Roll) => {
        onChange(assign(
            {}, value, {roll},
        ));
    }, [onChange, value]);

    const onDropdown = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        onChange(assign(
            {}, value, {
                damageType: data.value,
            },
        ));
    }, [onChange, value]);

    return isNil(value) ? (
        <Checkbox checked label={'No damage'} onChange={onChecked}/>
    ) : (
        <>
            <Form.Field
                required={required}
            >
                <label htmlFor={`${id}-roll`}>{label}</label>
                <RollInput
                    id={`${id}-roll`}
                    onChange={onRoll}
                    value={value.roll}
                    required={required}
                />
            </Form.Field>
            <Form.Field
                required={required}
            >
                <label htmlFor={`${id}-type`}>{label} type</label>
                <Dropdown
                    id={`${id}-type`}
                    selection
                    options={damageTypes.map(t => ({
                        key: t, value: t, text: t,
                    }))}
                    value={value.damageType}
                    onChange={onDropdown}
                />
            </Form.Field>
        </>
    )
}
