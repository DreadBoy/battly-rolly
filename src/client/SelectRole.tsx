import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Link} from 'react-router-dom';

const useStyles = createUseStyles({
    selectRole: {},
});

export const SelectRole: FC = () => {
    useStyles();
    return (
        <div>
            <h1>Select role</h1>
            <Link to={'/gm'}>GM</Link>
            <br/>
            <Link to={'/player'}>Player</Link>
            <h1><Link to={'/v2'}>🎉 Version 2 🎉</Link></h1>
        </div>
    );
};
