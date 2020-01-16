import React, {createContext, FC, useCallback, useContext, useState} from 'react';
import {Action} from './reducer';
import Io from 'socket.io-client';
import {Connect} from './Connect';

type SocketContext = {
    connected: boolean,
    send: (action: Action) => void,
    claim: () => void,
    claimed: boolean,
}

const socketContext = createContext<SocketContext>(undefined as any);

export const SocketProvider: FC = ({children}) => {
    const [socket, setSocket] = useState<SocketIOClient.Socket>();
    const connected = !!socket;
    const send = useCallback((action: Action) => {
        if (!socket)
            return;
        socket.emit('action', action);
    }, [socket]);
    const connect = useCallback((origin: string) => {
        const s = Io.connect(origin);
        setSocket(s);
        s.on('disconnect', () => {
            setSocket(undefined);
        });
    }, []);

    const [claimed, setClaimed] = useState<boolean>(false);
    const claim = useCallback(() => {
        if (!socket)
            return false;
        socket.emit('claim', setClaimed);
        return true;
    }, [socket]);
    return (
        <socketContext.Provider value={{connected, send, claim, claimed}}>
            {connected ? children : (
                <Connect connect={connect}/>
            )}
        </socketContext.Provider>
    )
};

export const useSocket = () => useContext(socketContext);

