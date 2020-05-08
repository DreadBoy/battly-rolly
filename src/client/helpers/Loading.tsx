import React, {FC, ReactElement} from 'react';
import {Store} from './Store';
import {Loader} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {Stacktrace} from './Stacktrace';

type Props<T> = {
    store: Store<T>
    id: string
    render: (data: T) => ReactElement | null
}

export const LoadingFactory = <T extends object>(): FC<Props<T>> => observer(({store, id, render}) => {
    return store.loading[id] ? (
        <Loader active size='large' inline={'centered'}/>
    ) : store.error[id] ? (
        <Stacktrace error={store.error[id]}/>
    ) : store.data[id] ?
        render(store.data[id])
        : null;
});
