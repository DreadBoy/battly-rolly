import {createUseStyles} from 'react-jss';
import React, {FC, useEffect, useState} from 'react';
import {useSocket} from '../common/Socket';
import {useDispatch, useStore} from 'react-redux';
import {State} from '../common/reducer';
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
    const store = useStore<State>();

    const [claimed, setClaimed] = useState<boolean>(false);
    useEffect(() => {
        if (claimed)
            return;
        socket?.emit('claim', setClaimed);
    }, [claimed, socket]);

    useEffect(() => {
        socket?.on('action', dispatch);
    }, [dispatch, socket]);
    useEffect(() => {
        return store.subscribe(() =>
            socket?.emit('state', store.getState()));
    }, [socket, store]);
    useEffect(() => {
        if (claimed)
            socket?.emit('state', store.getState());
    }, [claimed, socket, store]);


    return claimed ? (
        <>{children}</>
    ) : (
        <Splash bg={bg} position={'88% center'}>
            {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
            <Header as='h1' className={classes.h1}>Game is already claimed by somebody else 😢</Header>
        </Splash>
    );
};
