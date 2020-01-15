import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';

const useStyles = createUseStyles({
    player: {},
});

export const Player: FC = () => {
    const classes = useStyles();
    return (
        <div>Player</div>
    );
};
