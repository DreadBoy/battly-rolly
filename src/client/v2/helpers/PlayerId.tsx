import React, {createContext, FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useBackend} from './BackendProvider';
import {Login, OnLogin} from '../user/Login';
import {useLocalStorage} from '../hooks/use-local-storage';
import {toJS} from 'mobx';
import {User} from '../../../server/model/user';
import {AxiosRequestConfig} from 'axios';
import {useLocation} from 'react-router';
import {root} from '../v2';

const playerIdContext = createContext<{ id: string, user?: User, onLogin: (onLogin: OnLogin | null) => void }>(undefined as any);

export const PlayerIdProvider: FC = ({children}) => {
    const {api, socket} = useBackend();

    const [init, setInit] = useState<boolean>(false);
    const {value, set} = useLocalStorage<OnLogin>('player');
    const accessToken = useRef<string | undefined>(value?.accessToken);
    const userId = value?.user?.id;
    const data = useRef<OnLogin | null>(null);
    useEffect(() => {
        data.current = value;
    }, [value])

    const onLogin = useCallback((onLogin: OnLogin | null) => {
        set(onLogin);
        accessToken.current = onLogin?.accessToken;
        console.log(toJS(onLogin));
    }, [set]);

    const setHeader = useCallback((config: AxiosRequestConfig) => {
        config.headers['Authorization'] = `Bearer ${accessToken.current}`;
        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        return config;
    }, []);

    useEffect(() => {
        if (init)
            return;
        api.interceptors.request.use(setHeader);
        api.interceptors.response.use(undefined, async error => {
            const shouldRepeat = error.response?.status === 401 && !error.config?._retry && !!data.current?.refreshToken;
            if (!shouldRepeat) {
                throw error;
            }
            error.config._retry = true;
            try {
                const res = await api.put<OnLogin>('/auth/refresh', {refreshToken: data.current?.refreshToken});
                if (res?.status !== 200) {
                    onLogin(null);
                } else {
                    onLogin(res.data);
                    error.config = setHeader(error.config);
                    return api(error.config);
                }
            } catch (e) {
                onLogin(null);
                throw error;
            }
        });

        socket?.emit('join', userId);
        socket?.emit('repeat', 'encounter');
        setInit(true);
    }, [api, init, onLogin, setHeader, socket, userId])

    const valid = !!value;

    const {pathname} = useLocation();
    const showRegister = pathname === root('/register');
    return (
        <playerIdContext.Provider value={{id: userId ?? '', user: value?.user, onLogin}}>
            {(init && valid) || showRegister ? children : (
                <Login onLogin={onLogin}/>
            )}
        </playerIdContext.Provider>
    )
};

export const usePlayerId = () => useContext(playerIdContext);
