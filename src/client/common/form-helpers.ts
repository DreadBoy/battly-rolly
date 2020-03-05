import {ChangeEventHandler, default as React, useCallback, useState} from 'react';
import {TextAreaProps} from 'semantic-ui-react/dist/commonjs/addons/TextArea/TextArea';

export function useText(defaultValue: string = '') {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
        setValue(event.target.value);
    }, []);
    return {value, onChange}
}

export function useNumber(defaultValue: string = '') {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
        setValue(event.target.value);
    }, []);
    const num = parseFloat(value || '');
    const isValid = !isNaN(num);
    return {value, number: num, isValid, onChange}
}

export function useTextArea(defaultValue: string = '') {
    const [value, setValue] = useState<string>(defaultValue);
    const onChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
        setValue(data?.value?.toString() ??  '');
    }, []);
    return {value, onChange, setValue}
}
