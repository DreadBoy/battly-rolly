import React, {createContext, FC, useContext, useEffect, useMemo, useState} from 'react';
import {debounce} from 'lodash';

type TouchContext = {
    touches: number,
};

const touchContext = createContext<TouchContext>({touches: 0});

export const TouchProvider: FC = ({children}) => {

    const [touches, setTouches] = useState<number>(0);

    const onTouchStart = useMemo(() => debounce((e: TouchEvent) => {
        setTouches(e.touches.length);
    }, 200), [setTouches]);

    useEffect(() => {
        const cached = onTouchStart;
        window.addEventListener('touchstart', cached);
        return () => window.removeEventListener('touchstart', cached);
    }, [onTouchStart]);

    return (
        <touchContext.Provider value={{touches}}>
            {children}
        </touchContext.Provider>
    )
};

export const useTouches = () => useContext(touchContext);
