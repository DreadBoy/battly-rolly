import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Message} from 'semantic-ui-react';

const useStyles = createUseStyles({
    pre: {
        overflowX: 'auto',
    },
});

export const Stacktrace: FC<{error: Error}> = ({error}) => {
    const classes = useStyles();
    return (
        <Message negative>
            {error.message ? (
                <Message.Header>{error.message}</Message.Header>
            ) : (
                <Message.Header>Something went wrong but we don't know what</Message.Header>
            )}
            {error.stack && <pre className={classes.pre}><code>{error.stack}</code></pre>}
        </Message>

    );
};
