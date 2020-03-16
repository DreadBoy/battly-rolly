import {Campaign} from '../../../server/model/campaign';
import {Store} from './Store';
import React, {createContext, FC, useContext} from 'react';

type StoreContext = {
    campaign: Store<Campaign>,
    campaigns: Store<Campaign[]>,
}
const storeContext = createContext<StoreContext>(undefined as any);

export const StoreProvider: FC = ({children}) => (
    <storeContext.Provider
        value={{
            campaign: new Store<Campaign>(),
            campaigns: new Store<Campaign[]>(),
        }}
    >
        {children}
    </storeContext.Provider>
);

export const useStore = () => useContext(storeContext);
