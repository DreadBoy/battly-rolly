import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react';
import {Button, Input} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import {useNumber} from '../../../hooks/form-helpers';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Feature} from '../../../../server/model/feature';

type Props = {
    id: string,
    HP: number,
    initialHP: number,
}

const useStyles = createUseStyles({
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

})

export const MonsterHP: FC<Props> = observer(({id, HP, initialHP}) => {
    const classes = useStyles();
    const {api} = useBackend();

    const [input, setInput] = useState<boolean>(false);
    const toggle = useCallback(() => {
        setInput(!input);
    }, [input]);

    const text = useNumber(HP.toString());
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
            type={'number'}
            size={'mini'}
            className={classes.wrapper}
            disabled={_confirm.loading[id]}
            value={text.value}
            onChange={text.onChange}
        >
            &nbsp;
            <input className={classes.input}/>
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
});
