import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Header} from 'semantic-ui-react';

type Props = {
    as?: string,
}

const useStyles = createUseStyles({
    h1: {
        textAlign: 'center',
    },
});

export const Message: FC<Props> = ({as, children}) => {
    const classes = useStyles();
    return (
        <Header as={as} className={classes.h1}>{children}</Header>
    );
};
Message.defaultProps = {
    as: 'h1',
};
