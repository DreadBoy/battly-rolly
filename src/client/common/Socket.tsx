import React, {createContext, FC, useCallback, useContext, useState} from 'react';
import {Action} from './reducer';
import Io from 'socket.io-client';
import {Connect} from './Connect';

type SocketContext = {
    socket: SocketIOClient.Socket | undefined,
    connected: boolean,
    send: (action: Action) => void,
}

const socketContext = createContext<SocketContext>(undefined as any);

export const SocketProvider: FC = ({children}) => {
    const [socket, setSocket] = useState<SocketIOClient.Socket>();
    const connected = !!socket;
    const connect = useCallback((origin: string) => {
        const s = Io.connect(origin);
        setSocket(s);
        s.on('disconnect', () => {
            setSocket(undefined);
        });
    }, []);

    const send = useCallback((action: Action) => {
        socket?.emit('action', action);
    }, [socket]);

    return (
        <socketContext.Provider value={{connected, send, socket}}>
            {connected ? children : (
                <Connect connect={connect}/>
            )}
        </socketContext.Provider>
    )
};

export const useSocket = () => useContext(socketContext);

