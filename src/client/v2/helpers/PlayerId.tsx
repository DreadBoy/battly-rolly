import React, {createContext, FC, useCallback, useContext, useEffect, useState} from 'react';
import {useLocalStorage} from '../../common/use-local-storage';
import {useBackend} from './BackendProvider';
import {User} from '../../../server/model/user';
import {Login} from '../user/Login';

const playerIdContext = createContext<{ id: string }>(undefined as any);

export const PlayerIdProvider: FC = ({children}) => {
    const [init, setInit] = useState(false);
    const {value, set} = useLocalStorage('playerId');
    const {api, socket} = useBackend();
    const connect = useCallback(() => {
        api.post<User>('/user', {name: 'Temporary name'})
            .then(res => {
                set(res.data.id)
            })
            .catch(e => alert(e));
    }, [api, set]);

    useEffect(() => {
        if (!value) return;
        api.defaults.headers.common['Authorization'] = value;
        socket?.emit('join', value);
        socket?.emit('repeat', 'encounter');
        setInit(true);
    }, [api.defaults.headers.common, socket, value]);
    return (
        <playerIdContext.Provider value={{id: value || ''}}>
            {init ? children : (
                <Login/>
            )}
        </playerIdContext.Provider>
    )
};

export const usePlayerId = () => useContext(playerIdContext);
