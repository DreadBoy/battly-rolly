import {FormInputProps} from 'semantic-ui-react';

/*
    This will force input to be integer, disallowing any decimal
    values. It will also be bound inside Postgresql's `integer`
    values.
 */
export const integer: FormInputProps = {
    type: 'number',
    pattern: '[0-9]',
    max: 2147483647,
    min: -2147483648,
};
