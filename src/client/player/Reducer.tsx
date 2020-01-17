import {createUseStyles} from 'react-jss';
import React, {FC, useEffect, useState} from 'react';
import {useSocket} from '../common/Socket';
import {useDispatch} from 'react-redux';
import {State} from '../common/reducer';
import {usePlayerId} from './PlayerId';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Header} from 'semantic-ui-react';

const useStyles = createUseStyles({
    h1: {
        textAlign: 'center',
    },
});

export const Reducer: FC = ({children}) => {
    const classes = useStyles();
    const {socket} = useSocket();
    const dispatch = useDispatch();
    const id = usePlayerId();

    const [joined, setJoined] = useState<boolean>(false);
    useEffect(() => {
        if (joined)
            return;
        console.log('Joining with id', id);
        socket?.emit('join', id, setJoined);
    }, [id, joined, socket]);

    useEffect(() => {
        socket?.on('state', (state: State) => dispatch({type: 'SET STATE', payload: state}));
    }, [dispatch, socket]);
    return joined ? (
        <>{children}</>
    ) : (
        <Splash bg={bg} position={'88% center'}>
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <Header as='h1' className={classes.h1}>No game is running at the moment 😢</Header>
        </Splash>
    );
};
