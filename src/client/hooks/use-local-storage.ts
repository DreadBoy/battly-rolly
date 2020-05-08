import {useCallback, useState} from 'react';

export function useLocalStorage<T = string>(key: string) {

    const get = useCallback(() => {
        const value = window.localStorage.getItem(key);
        if (value !== null)
            return JSON.parse(value);
        return value;
    }, [key]);
    const [value, setValue] = useState<T | null>(get());

    const set = useCallback((value: T | null) => {
        window.localStorage.setItem(key, JSON.stringify(value));
        setValue(get());
    }, [get, key]);
    const remove = useCallback(() => {
        window.localStorage.removeItem(key);
        setValue(get());
    }, [get, key]);

    return {value, set, remove};
}
