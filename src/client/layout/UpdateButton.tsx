import React, {FC, useCallback, useState} from 'react';
import {useServiceWorker} from '../hooks/use-service-worker';
import {Message, Button, Icon} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles({
    message: {
        '.ui.message&': {
            position: 'fixed',
            top: 10,
            left: '50%',
            transform: 'translate(-50%, 0)',
        },
    },
    button: {
        '.ui.button&': {
            margin: '0 20px 0 10px',
        },
    },
})

export const UpdateButton: FC = () => {
    const classes = useStyles();
    const {isUpdateAvailable, update} = useServiceWorker();

    const [hidden, _setHide] = useState<boolean>(false);
    const hide = useCallback(() => {
        _setHide(true);
    }, []);

    if (!isUpdateAvailable || hidden) return null;

    return (
        <Message floating className={classes.message}>
            New update is available, click to apply!
            <Button onClick={update} primary basic size={'mini'} className={classes.button}>Apply</Button>
            <Icon name={'close'} onClick={hide}/>
        </Message>
    )
}
