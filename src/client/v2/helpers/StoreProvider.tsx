import {Campaign} from '../../../server/model/campaign';
import {User} from '../../../server/model/user';
import {Store} from './Store';
import React, {createContext, FC, useContext} from 'react';

export type StoreContext = {
    campaign: Store<Campaign>,
    campaigns: Store<Campaign[]>,
    user: Store<User>,
}
const storeContext = createContext<StoreContext>(undefined as any);

export const StoreProvider: FC = ({children}) => (
    <storeContext.Provider
        value={{
            campaign: new Store<Campaign>(),
            campaigns: new Store<Campaign[]>(),
            user: new Store<User>(),
        }}
    >
        {children}
    </storeContext.Provider>
);

export const useStore = () => useContext(storeContext);
