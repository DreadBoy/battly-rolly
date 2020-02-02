import React, {FC, useEffect, useRef} from 'react';
import {Input as BaseInput, InputProps} from 'semantic-ui-react';

type Props = InputProps & {
    focused?: boolean
}

export const Input: FC<Props> = ({focused, ...props}) => {

    const input = useRef<HTMLInputElement>();
    useEffect(() => {
        if (!input.current)
            return;
        if (focused)
            input.current.focus();
        else
            input.current.blur();
    }, [focused]);

    return (
        <BaseInput {...props} ref={(i: BaseInput) => {
            if (!i)
                return;
            // @ts-ignore
            input.current = i.inputRef.current;
            if (input.current && focused)
                input.current.focus();
        }}/>
    );
};
Input.defaultProps = {
    focused: false,
};

