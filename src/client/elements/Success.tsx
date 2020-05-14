import React, {FC} from 'react';
import {Message} from 'semantic-ui-react';

type Props = {
    message: string,
    show?: boolean,
}

// kaj če dobim 204, je data še vedno !== null

export const Success: FC<Props> = ({message, show}) => {
    return show ? (
        <Message positive>
            <Message.Header>{message}</Message.Header>
        </Message>
    ) : null;
};
Success.defaultProps = {
    show: false,
}
