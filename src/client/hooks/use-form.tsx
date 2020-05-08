import {default as React} from 'react';
import {DropdownProps, InputOnChangeData} from 'semantic-ui-react';
import {isEmpty} from 'lodash';

export function onText<T>(obj: T, key: keyof T) {
    return function (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) {
        // @ts-ignore
        obj[key] = data.value;
    };
}

export function onNumber<T>(obj: T, key: keyof T) {
    return function (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) {
        const num = parseFloat(data.value || '');
        if (!isNaN(num)) {
            // @ts-ignore
            obj[key] = num;
        } else if (isEmpty(data.value)) {
            // @ts-ignore
            obj[key] = undefined;
        }
    };
}
export function onDropdown<T>(obj: T, key: keyof T) {
    return function (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
        // @ts-ignore
        obj[key] = data.value;
    };
}
