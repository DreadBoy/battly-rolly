import React, {createContext, FC, useContext, useEffect, useState} from 'react';
import {generateId} from '../common/generate-id';

const playerIdContext = createContext<string>('');

export const PlayerIdProvider: FC = ({children}) => {
    const [id, setId] = useState<string>('');
    useEffect(() => {
        setId(generateId());
    }, []);
    return (
        <playerIdContext.Provider value={id}>
            {id ? children : null}
        </playerIdContext.Provider>
    )
};

export const usePlayerId = () => useContext(playerIdContext);
