import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {State} from '../common/reducer';

const useStyles = createUseStyles({
    state: {},
});

export const Phase: FC = () => {
    useStyles();
    const phase = useSelector((state: State) => state.phase);
    return (
        <div>{phase}</div>
    );
};
