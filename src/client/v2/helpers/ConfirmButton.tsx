import React, {FC, useState} from 'react';
import {Button, StrictButtonProps} from 'semantic-ui-react';

export const ConfirmButton: FC<Pick<StrictButtonProps, 'onClick'>> = ({children, onClick}) => {
    const [clicked, setClicked] = useState(false);
    return clicked ? (
        <Button.Group size={'mini'}>
            <Button basic color={'blue'} onClick={() => setClicked(false)}>Cancel</Button>
            <Button basic color={'red'} onClick={(e, d) => {
                setClicked(false);
                onClick && onClick(e, d);
            }}>{children}</Button>
        </Button.Group>
    ) : (
        <Button basic size={'mini'} color={'red'} onClick={() => setClicked(true)}>{children}</Button>
    );
};
