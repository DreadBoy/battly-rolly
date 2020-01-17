import {useCallback, useState} from 'react';

export function useLocalStorage(key: string) {
    const get = useCallback(() => {
        return window.localStorage.getItem(key);
    }, [key]);
    const [val, setVal] = useState<string | null>(get());

    const set = useCallback((value: string) => {
        window.localStorage.setItem(key, value);
        setVal(get());
    }, [get, key]);
    const remove = useCallback(() => {
        window.localStorage.removeItem(key);
        setVal(get());
    }, [get, key]);
    return {value: val, set, remove};
}
