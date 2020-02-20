import React, {createContext, FC, useCallback, useContext, useEffect, useState} from 'react';
import {debounce} from 'lodash';

type TouchContext = {
    touches: number,
};

const touchContext = createContext<TouchContext>({touches: 0});

export const TouchProvider: FC = ({children}) => {

    const [touches, setTouches] = useState<number>(0);

    const onTouchStart = useCallback(debounce((e: TouchEvent) => {
        setTouches(e.touches.length);
    }, 200), []);
    useEffect(() => {
        window.addEventListener('touchstart', onTouchStart);
        return () => window.removeEventListener('touchstart', onTouchStart);
    }, [onTouchStart]);

    console.log(touches);

    return (
        <touchContext.Provider value={{touches}}>
            {children}
        </touchContext.Provider>
    )
};

export const useTouches = () => useContext(touchContext);
