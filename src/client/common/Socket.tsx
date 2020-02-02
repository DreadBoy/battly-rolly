import React, {createContext, FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Action} from './reducer';
import Io from 'socket.io-client';
import {Connect} from './Connect';

type SocketContext = {
    socket: SocketIOClient.Socket | undefined,
    connected: boolean,
    send: <T extends Action = Action>(action: T) => void,
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

    const socketRef = useRef<SocketIOClient.Socket>();
    useEffect(() => {
        socketRef.current = socket
    }, [socket]);
    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
            setSocket(undefined);
        }
    }, []);

    const send = useCallback((action: Action) => {
        socketRef.current?.emit('action', action);
    }, []);

    return (
        <socketContext.Provider value={{connected, send, socket}}>
            {connected ? children : (
                <Connect connect={connect}/>
            )}
        </socketContext.Provider>
    )
};

export const useSocket = () => useContext(socketContext);

