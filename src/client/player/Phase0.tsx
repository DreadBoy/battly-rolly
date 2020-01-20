import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/MaoXBkH.jpg';
import {Message} from '../common/Message';

const useStyles = createUseStyles({
});

export const Phase0: FC = () => {
    useStyles();
    return (
        <Splash bg={bg} position={`23% center`}>
            <Message>Fast round</Message>
        </Splash>
    );
};
