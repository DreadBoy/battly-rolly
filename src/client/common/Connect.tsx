import {createUseStyles} from 'react-jss';
import React, {FC, useEffect} from 'react';
import {Button, Input} from 'semantic-ui-react';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Splash} from './Splash';
import {useProbe} from './useProbe';

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
        <Splash bg={bg} position={'88% center'}>
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
