import React, {createContext, FC, useContext, useEffect} from 'react';
import {generateId} from '../common/generate-id';
import {useLocalStorage} from '../common/use-local-storage';

const playerIdContext = createContext<string>('');

export const PlayerIdProvider: FC = ({children}) => {
    const {value, set} = useLocalStorage('playerId');
    useEffect(() => {
        if (!value)
            set(generateId());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <playerIdContext.Provider value={value || ''}>
            {value ? children : null}
        </playerIdContext.Provider>
    )
};

export const usePlayerId = () => useContext(playerIdContext);
