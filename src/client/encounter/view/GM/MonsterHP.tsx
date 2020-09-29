import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Input} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import {useNumber} from '../../../hooks/form-helpers';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Feature} from '../../../../server/model/feature';
import {integer} from '../../../helpers/integer';

type Props = {
    id: string,
    HP: number,
    initialHP: number,
}

export const styles = {
    wrapper: {
        verticalAlign: 'top',
        height: '1.4em',
    },
    input: {
        '.ui.form input[type=number]&': {
            padding: '0.4em',
            width: '4.5em',
        },
    },
    icon: {
        '.ui.icon.button&': {
            padding: '0.25em',
        },
    },

};

const useStyles = createUseStyles(styles);

export const MonsterHP: FC<Props> = ({id, HP, initialHP}) => {
    const classes = useStyles();
    const {api} = useBackend();

    const [input, setInput] = useState<boolean>(false);
    const toggle = useCallback(() => {
        setInput(!input);
    }, [input]);

    const text = useNumber(HP.toString());
    const textOnChange = text.onChange;
    useEffect(() => {
        textOnChange({target: {value: HP.toString()}} as any);
    }, [HP, textOnChange])
    const _confirm = useLoader();
    const confirm = useCallback(() => {
        _confirm.fetchAsync(api.put(`/feature/${id}`, {HP: text.number} as Feature), id)
            .then(toggle);
    }, [_confirm, api, id, text.number, toggle]);

    if (!input)
        return (
            <span onClick={toggle}> {HP} / {initialHP}</span>
        );

    return (
        <Input
            {...integer}
            size={'mini'}
            className={classes.wrapper}
            disabled={_confirm.loading[id]}
            value={text.value}
            onChange={text.onChange}
        >
            &nbsp;
            <input className={classes.input} autoFocus={true}/>
            <Button
                type='button'
                size={'mini'}
                className={classes.icon}
                disabled={!text.isValid || _confirm.loading[id]}
                loading={_confirm.loading[id]}
                icon={_confirm.loading[id] ? 'spinner' : 'check'}
                onClick={confirm}
            />
            <Button
                type='button'
                size={'mini'}
                icon={'close'}
                className={classes.icon}
                disabled={_confirm.loading[id]}
                onClick={toggle}
            />
        </Input>
    );
};
