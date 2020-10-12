import {createUseStyles} from 'react-jss';
import React, {FC, useEffect} from 'react';
import {Button, Input} from 'semantic-ui-react';
import {useProbe} from '../hooks/use-probe';
import { Splash } from '../layout/Splash';

type Props = {
    connect: (origin: string) => void,
}

const useStyles = createUseStyles({
    input: {
        marginBottom: 10,
    },
});

export const Connect: FC<Props> = ({connect}) => {
    const classes = useStyles();
    const {status, origin, setOrigin} = useProbe();
    useEffect(() => {
        if (status === 'success')
            connect(origin);
    }, [connect, origin, status]);
    return (
        <Splash>
            <Input
                loading={status === 'probing'}
                error={status === 'failure'}
                className={classes.input}
                icon={'search'}
                value={origin}
                onChange={event => setOrigin(event.target.value)}
            />
            <Button primary disabled={status !== 'success'} onClick={() => connect(origin)}>Connect</Button>
        </Splash>
    );
};
