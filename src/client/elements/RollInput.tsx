import React, {FC, useCallback} from 'react';
import {Dropdown, Input, InputProps, Label} from 'semantic-ui-react';
import {Roll} from '../../server/model/action-types';
import {createUseStyles} from 'react-jss';
import classNames from 'classnames';
import {DropdownProps} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import {InputOnChangeData} from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import {integer} from '../helpers/integer';

type Props = Pick<InputProps, 'id' | 'required'> & { value: Roll, onChange: (roll: Roll) => void }

const dice = [
    {key: '4', text: '4', value: '4'},
    {key: '6', text: '6', value: '6'},
    {key: '8', text: '8', value: '8'},
    {key: '10', text: '10', value: '10'},
    {key: '12', text: '12', value: '12'},
    {key: '20', text: '20', value: '20'},
]
const modifiers = [
    {key: '+', text: '+', value: '+'},
    {key: '-', text: '-', value: '-'},
]

const radius = '.28571429rem';
const border = '0 0 rgba(34,36,38,.15) inset';

const useStyles = createUseStyles({
    div: {
        display: 'flex',
    },
    label: {
        '.ui.basic.label&': {
            paddingTop: '.78571429em',
            paddingBottom: '.78571429em',
            borderRadius: 0,
            fontSize: '1em',
            borderWidth: '1px 0',
            margin: 0,
        },
    },
    inputLeft: {
        '.ui.form & input[type=number]': {
            borderRadius: `${radius} 0 0 ${radius}`,
        },
    },
    inputRight: {
        '.ui.form & input[type=number]': {
            borderRadius: `0 ${radius} ${radius} 0`,
        },
    },
    dropdown: {
        '.ui.button&': {
            margin: 0,
            borderRadius: 0,
            boxShadow: `0 1px ${border}, 0 -1px ${border}, 1px 0 ${border}`,
        },
    },
    die: {
        '.ui.button&': {
            flexBasis: 176,
        },
    },
    modifier: {
        '.ui.button&': {
            flexBasis: 146,
        },
    },

})

export const RollInput: FC<Props> = ({id, required, value, onChange, ...props}) => {
    const classes = useStyles();

    const mod = value[1] === 0 || value[1] / Math.abs(value[1]) >= 0 ? '+' : '-';
    const die = Math.abs(value[1]).toString();

    const onDropdown = useCallback((index: number) => (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        if (index === 0) {
            const die = parseInt(data.value as string);
            const sign = value[1] === 0 ? 1 : value[1] / Math.abs(value[1]);
            onChange([value[0], sign * die, value[2]]);
        } else if (index === 1) {
            const mod = data.value === '+' ? +1 : -1;
            onChange([value[0], Math.abs(value[1]) * mod, value[2]]);
        }
    }, [onChange, value]);

    const onNumber = useCallback((index: number) => (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        let num = parseInt(data.value || '');
        num = isNaN(num) ? undefined as unknown as number : num;
        const change: Roll = [value[0], value[1], value[2]];
        change[index] = num;
        onChange(change);
    }, [onChange, value]);

    return (
        <div className={classes.div}>
            <Input
                {...props}
                fluid
                className={classes.inputLeft}
                {...integer}
                onChange={onNumber(0)}
                value={value[0]?.toString() ?? ''}
                id={id}
                required={required}
            />
            <Label basic className={classes.label}>d</Label>
            <Dropdown
                button
                basic
                fluid
                className={classNames(classes.dropdown, classes.die)}
                options={dice}
                onChange={onDropdown(0)}
                value={die}
            />
            <Dropdown
                button
                basic
                fluid
                className={classNames(classes.dropdown, classes.modifier)}
                options={modifiers}
                onChange={onDropdown(1)}
                value={mod}
            />
            <Input
                {...props}
                fluid
                className={classes.inputRight}
                {...integer}
                onChange={onNumber(2)}
                value={value[2]?.toString() ?? ''}
                required={required}
            />
        </div>
    );
};
