import React, {createContext, FC, useContext, useEffect, useRef, useState} from 'react';
import Io from 'socket.io-client';
import Axios, {AxiosInstance, AxiosPromise} from 'axios';
import {BroadcastObject} from '../../server/service/socket';
import {useGlobalStore} from './GlobalStore';

type BackendContext = {
    origin: string,
    api: AxiosInstance;
    socket: SocketIOClient.Socket | undefined | null,
}

const backendContext = createContext<BackendContext>(undefined as any);

export const BackendProvider: FC = ({children}) => {
    /***
     * undefined means uninitialized, null means disconnected
     */
    const [socket, setSocket] = useState<SocketIOClient.Socket | null | undefined>(undefined);
    const origin = useRef<string>(`${window.location.protocol}//${window.location.hostname}`);
    const api = useRef<AxiosInstance>(Axios.create({
        baseURL: `${origin.current}/api`,
    }));
    const globalStore = useGlobalStore();

    useEffect(() => {
        const s = Io.connect(origin.current);
        s.on('connect', () => {
            setSocket(s);
            console.log('%c  <-- %cSOCKET', 'color:green', 'color:white');
            s.on('disconnect', () => {
                console.log('%c  --> %cSOCKET', 'color:red', 'color:white');
                setSocket(null);
            });
            s.addEventListener('encounter', (state: string) => {
                console.log('%c  <-- %cSOCKET %cencounter %o', 'color:gray', 'color:white', 'color:gray', JSON.parse(state));
            });
            s.addEventListener('object', ({model, data}: BroadcastObject) => {
                console.log(`%c  <-- %cSOCKET %cobject ${model} %o`,
                    'color:gray', 'color:white', 'color:gray', data);
                globalStore.set(data);
            });
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const socketRef = useRef<SocketIOClient.Socket>();
    useEffect(() => {
        socketRef.current = socket || undefined;
    }, [socket]);
    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
            setSocket(undefined);
        }
    }, []);

    return (
        <backendContext.Provider value={{socket, origin: origin.current, api: api.current}}>
            {children}
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
