import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {Encounter} from './Encounter';
import {Reducer} from './Reducer';
import {SocketProvider} from '../common/Socket';
import {createStore} from 'redux';
import {reducer, State} from '../common/reducer';
import {Provider as StoreProvider} from 'react-redux';

const preloadedState: State = {
    players: {},
    encounter: undefined,
};
const store = createStore(reducer, preloadedState);

export const Gm: FC = () => {
    const {path} = useRouteMatch();
    return (
        <StoreProvider store={store}>
            <SocketProvider>
                <Reducer>
                    <Switch>
                        <Route path={`${path}/encounter`}>
                            <Encounter/>
                        </Route>
                        <Route path={'*'}>
                            <Redirect to={`${path}/encounter`}/>
                        </Route>
                    </Switch>
                </Reducer>
            </SocketProvider>
        </StoreProvider>
    );
};
