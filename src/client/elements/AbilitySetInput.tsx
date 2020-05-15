import React, {FC, useCallback} from 'react';
import {Form, Input, InputProps} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {abilities, Ability, AbilitySet} from '../../server/model/action-types';
import {abilityShort} from '../helpers/display-helpers';
import {assign, drop, isEmpty, map, take} from 'lodash';
import {InputOnChangeData} from 'semantic-ui-react/dist/commonjs/elements/Input/Input';

type Props = Pick<InputProps, 'id' | 'label' | 'required'> &
    { value: AbilitySet, onChange: (set: AbilitySet) => void }

export const AbilitySetInput: FC<Props> = observer(({children, id, label, value, onChange, ...props}) => {

    const _onNumber = useCallback((ability: Ability) => (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const num = parseFloat(data.value || '');
        const change = assign({}, value);
        if (!isNaN(num)) {
            change[ability] = num;
        } else if (isEmpty(data.value)) {
            change[ability] = undefined as unknown as number;
        }
        onChange(change);
    }, [onChange, value]);

    const field = useCallback((ability: Ability, index: number) => (
        <Form.Field key={ability}>
            <Input
                {...props}
                id={index === 0 ? id : ''}
                fluid
                type={'number'}
                label={abilityShort(ability)}
                labelPosition={'left'}
                value={value[ability]?.toString() ?? ''}
                onChange={_onNumber(ability)}
            />
        </Form.Field>
    ), [_onNumber, id, props, value]);

    return (
        <Form.Field required={props.required}>
            <label htmlFor={id}>{label}</label>
            <Form.Group widths={'equal'}>
                {map(take(abilities, 3), (ability, index) => field(ability, index))}
            </Form.Group>
            <Form.Group widths={'equal'}>
                {map(drop(abilities, 3), (ability, index) => field(ability, index + 3))}
            </Form.Group>
        </Form.Field>
    );
});
