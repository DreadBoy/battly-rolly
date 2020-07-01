import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Input} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import {useText} from '../../../hooks/form-helpers';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Feature} from '../../../../server/model/feature';
import {featureToDisplay} from '../../../helpers/display-helpers';
import {isEmpty} from 'lodash';
import {styles} from './MonsterHP';

type Props = {
    feature: Feature,
}

const useStyles = createUseStyles({
    ...styles,
    input: {
        '.ui.form input[type=text]&': {
            padding: '0.4em',
            width: '7em',
        },
    },
})

export const MonsterName: FC<Props> = ({feature}) => {
    const classes = useStyles();
    const {api} = useBackend();

    const [input, setInput] = useState<boolean>(false);
    const toggle = useCallback(() => {
        setInput(!input);
    }, [input]);

    const text = useText(feature.name ?? undefined);
    const textOnChange = text.onChange;
    useEffect(() => {
        textOnChange({target: {value: feature.name}} as any);
    }, [feature.name, textOnChange])
    const _confirm = useLoader();
    const confirm = useCallback(() => {
        _confirm.fetchAsync(api.put(`/feature/${feature.id}`, {name: text.value} as Feature), feature.id)
            .then(toggle);
    }, [_confirm, api, feature.id, text.value, toggle]);

    if (!input)
        return (
            <span onClick={toggle}>{featureToDisplay(feature)}</span>
        );

    return (
        <Input
            size={'mini'}
            className={classes.wrapper}
            disabled={_confirm.loading[feature.id]}
            value={text.value}
            onChange={text.onChange}
        >
            &nbsp;
            <input className={classes.input} autoFocus={true}/>
            <Button
                type='button'
                size={'mini'}
                className={classes.icon}
                disabled={isEmpty(text.value) || _confirm.loading[feature.id]}
                loading={_confirm.loading[feature.id]}
                icon={_confirm.loading[feature.id] ? 'spinner' : 'check'}
                onClick={confirm}
            />
            <Button
                type='button'
                size={'mini'}
                icon={'close'}
                className={classes.icon}
                disabled={_confirm.loading[feature.id]}
                onClick={toggle}
            />
        </Input>
    );
};
