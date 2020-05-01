import React, {createContext, FC, useCallback, useContext, useEffect, useState} from 'react';
import {useLocalStorage} from '../../common/use-local-storage';
import {useBackend} from './BackendProvider';
import {Login, OnLogin} from '../user/Login';

const playerIdContext = createContext<{ id: string }>(undefined as any);

export const PlayerIdProvider: FC = ({children}) => {
    const [init, setInit] = useState(false);
    const {value, set} = useLocalStorage('player');
    const data = value ? JSON.parse(value) as OnLogin : null;
    const {api, socket} = useBackend();

    useEffect(() => {
        if (!data) return;
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        socket?.emit('join', data.user.id);
        socket?.emit('repeat', 'encounter');
        setInit(true);
    }, [api.defaults.headers.common, data, socket]);

    const onLogin = useCallback((onLogin: OnLogin) => {
        set(JSON.stringify(onLogin));
    }, [set]);
    return (
        <playerIdContext.Provider value={{id: data?.user?.id ?? ''}}>
            {init ? children : (
                <Login onLogin={onLogin}/>
            )}
        </playerIdContext.Provider>
    )
};

export const usePlayerId = () => useContext(playerIdContext);
