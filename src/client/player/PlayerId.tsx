import React, {createContext, FC, useContext, useEffect, useState} from 'react';

const playerIdContext = createContext<string | undefined>(undefined);

export const PlayerIdProvider: FC = ({children}) => {
    const [id, setId] = useState<string>();
    useEffect(() => {
        setId(Math.floor(Math.random() * 1000000).toString());
    }, []);
    return (
        <playerIdContext.Provider value={id}>
            {id ? children : null}
        </playerIdContext.Provider>
    )
};

export const usePlayerId = () => useContext(playerIdContext);
