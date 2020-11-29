import React, {createContext, FC, useContext} from 'react';
import {useLocalObservable} from 'mobx-react';
import {createStore, TStore} from './Store';

const globalStoreContext = createContext<TStore | null>(null);

export const GlobalStoreProvider: FC = ({children}) => {
    const store = useLocalObservable(createStore);
    return (
        <globalStoreContext.Provider value={store}>{children}</globalStoreContext.Provider>
    );
}

export function useGlobalStore() {
    const store = useContext(globalStoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.')
    }
    return store;
}
