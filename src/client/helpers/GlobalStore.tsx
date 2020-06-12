import React, {createContext, FC, useContext} from 'react';
import {useLocalStore} from 'mobx-react';
import {createStore, TStore} from './Store';

const globalStoreContext = createContext<TStore | null>(null);

export const GlobalStoreProvider: FC = ({children}) => {
    const store = useLocalStore(createStore);
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
