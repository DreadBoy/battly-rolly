import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useEffect, useState} from 'react';
import Axios from 'axios';
import {Button, Input} from 'semantic-ui-react';
import {fullColumn} from '../common/styles';

const useStyles = createUseStyles({
    wrapper: {
        ...fullColumn,
    },
    input: {
        marginBottom: 10,
    },
});

export const Connect: FC = () => {
    const classes = useStyles();
    const [probe, setProbe] = useState<'none' | 'probing' | 'success' | 'failure'>('none');
    const [origin, setOrigin] = useState<string>('');
    useEffect(() => setOrigin(`${window.location.protocol}//${window.location.hostname}:3000`), []);

    const check = useCallback(async () => {
        if (origin.length === 0)
            return;
        setProbe('probing');
        const res = await Axios.get(`${origin}/probe`);
        if (res.status !== 200)
            throw new Error();
        setProbe('success');
    }, [origin]);
    useEffect(() => {
        check().catch(() => setProbe('failure'));
    }, [check]);

    return (
        <div className={classes.wrapper}>
            <Input
                loading={probe === 'probing'}
                error={probe === 'failure'}
                className={classes.input}
                icon={'search'}
                value={origin}
                onChange={event => setOrigin(event.target.value)}
            />
            <Button primary disabled={probe !== 'success'}>Connect</Button>
        </div>
    );
};
