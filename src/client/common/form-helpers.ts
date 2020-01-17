import {ChangeEventHandler, useCallback, useState} from 'react';

export function useText() {
    const [value, setValue] = useState<string>('');
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
        setValue(event.target.value);
    }, []);
    return {value, onChange}
}

export function useNumber(defaultValue: string) {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
        setValue(event.target.value);
    }, []);
    const num = parseFloat(value || '');
    const isValidNum = !isNaN(num);
    return {value, number: isValidNum ? num : undefined, isValid: isValidNum, onChange}
}
