import React, {createContext, FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import Io from 'socket.io-client';
import {Connect} from '../../common/Connect';
import Axios, {AxiosInstance, AxiosPromise} from 'axios';

type BackendContext = {
    origin: string,
    api: AxiosInstance;
    socket: SocketIOClient.Socket | undefined,
    connected: boolean,
}

const backendContext = createContext<BackendContext>(undefined as any);

export const BackendProvider: FC = ({children}) => {
    const [socket, setSocket] = useState<SocketIOClient.Socket>();
    const [origin, setOrigin] = useState<string>('');
    const [api, setApi] = useState<AxiosInstance>();

    const connected = !!origin && origin.length > 0;

    const connect = useCallback((origin: string) => {
        const s = Io.connect(origin);
        setSocket(s);
        s.on('disconnect', () => {
            setSocket(undefined);
        });

        const api = Axios.create({
            baseURL: origin,
        });
        setApi(() => api);

        setOrigin(origin);
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

    return (
        <backendContext.Provider value={{connected, socket, origin, api: api as AxiosInstance}}>
            {connected ? children : (
                <Connect connect={connect}/>
            )}
        </backendContext.Provider>
    )
};

export const useBackend = () => useContext(backendContext);

export function fakeRequest<T>(creator: () => Partial<T>, status = 200): AxiosPromise<T> {
    return Promise.resolve({
        data: creator(),
        status,
    } as any);
}
