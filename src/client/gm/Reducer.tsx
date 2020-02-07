import React, {FC, useEffect, useState} from 'react';
import {useSocket} from '../common/Socket';
import {useDispatch, useStore} from 'react-redux';
import {State} from '../common/reducer';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Message} from '../common/Message';
import {sadFace} from '../common/emojis';

export const Reducer: FC = ({children}) => {
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
        socket?.on('state', (state: State) => dispatch({type: 'SET STATE', payload: state}));
    }, [dispatch, socket]);

    useEffect(() => {
        return store.subscribe(() => {
            const state = store.getState();
            console.log(state);
            socket?.emit('state', state);
        });
    }, [socket, store]);

    useEffect(() => {
        if (claimed)
            socket?.emit('state', store.getState());
    }, [claimed, socket, store]);


    return claimed ? (
        <>{children}</>
    ) : (
        <Splash bg={bg} position={'88% center'}>
            <Message>Game is already claimed by somebody else {sadFace}</Message>
        </Splash>
    );
};
