import React, {FC, useState} from 'react';
import {Button, StrictButtonProps} from 'semantic-ui-react';
import {SemanticCOLORS} from 'semantic-ui-react/dist/commonjs/generic';


type Color = SemanticCOLORS | 'facebook' | 'google plus' | 'vk' | 'twitter' | 'linkedin' | 'instagram' | 'youtube';

export const ConfirmButton: FC<StrictButtonProps & { colors?: [Color, Color] }> = (
    {
        children,
        size,
        colors = ['red', 'blue'],
        onClick,
        color,
        ...props
    }) => {
    const [clicked, setClicked] = useState(false);
    return clicked ? (
        <Button.Group size={size}>
            <Button color={colors[1]} {...props} onClick={() => setClicked(false)}>Cancel</Button>
            <Button color={colors[0]} {...props} onClick={(e, d) => {
                setClicked(false);
                onClick && onClick(e, d);
            }}>{children}</Button>
        </Button.Group>
    ) : (
        <Button size={size} color={colors[0]} {...props} onClick={() => setClicked(true)}>{children}</Button>
    );
};
