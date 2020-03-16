import React, {FC, ReactElement} from 'react';
import {Store} from './Store';
import {Loader, Message} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {createUseStyles} from 'react-jss';

type Props<T> = {
    store: Store<T>
    id: string
    render: (data: T) => ReactElement | null
}

const useStyles = createUseStyles({
    pre: {
        overflowX: 'auto',
    },
});
export const LoadingFactory = <T extends object>(): FC<Props<T>> => observer(({store, id, render}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const classes = useStyles();
    return store.loading[id] ? (
        <Loader active size='large' inline={'centered'}/>
    ) : store.error[id] ? (
        <Message negative>
            {store.error[id].message ? (
                <Message.Header>{store.error[id].message}</Message.Header>
            ) : (
                <Message.Header>Something went wrong but we don't know what</Message.Header>
            )}
            {store.error[id].stack && <pre className={classes.pre}><code>{store.error[id].stack}</code></pre>}
        </Message>
    ) : store.data[id] ?
        render(store.data[id])
        : null;
});
