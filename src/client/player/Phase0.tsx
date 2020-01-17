import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/MaoXBkH.jpg';
import {Header} from 'semantic-ui-react';

const useStyles = createUseStyles({
    h1: {
        textAlign: 'center',
    },
});

export const Phase0: FC = () => {
    const classes = useStyles();
    return (
        <Splash bg={bg} position={`23% center`}>
            <Header as='h1' className={classes.h1}>Fast round</Header>
        </Splash>
    );
};
