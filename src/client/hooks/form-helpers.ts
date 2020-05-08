import {ChangeEventHandler, default as React, useCallback, useState} from 'react';
import {DropdownProps, TextAreaProps} from 'semantic-ui-react';

export function useText(defaultValue: string = '') {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
        setValue(event.target.value);
    }, []);
    const reset = useCallback(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return {value, onChange, reset}
}

export function useNumber(defaultValue: string = '') {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
        setValue(event.target.value);
    }, []);
    const reset = useCallback(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    const num = parseFloat(value || '');
    const isValidNum = !isNaN(num);
    return {
        value,
        number: num,
        isValid: isValidNum,
        isPositive: isValidNum && num > 0,
        onChange,
        reset,
    }
}

export function useTextArea(defaultValue: string = '') {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
        setValue(data?.value?.toString() ?? '');
    }, []);
    const reset = useCallback(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return {value, onChange, reset, setValue}
}

export function useDropdown(defaultValue: string = '') {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback((event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        setValue(data?.value?.toString() ?? '');
    }, []);
    const reset = useCallback(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    return {value, onChange, reset, setValue}
}
