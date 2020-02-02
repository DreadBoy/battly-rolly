import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {ConfirmStats} from './ConfirmStats';
import {Reducer} from './Reducer';
import {PlayerIdProvider} from './PlayerId';
import {SocketProvider} from '../common/Socket';
import {Encounter} from './Encounter';
import {Provider as StoreProvider} from 'react-redux';
import {reducer, State} from '../common/reducer';
import {createStore} from 'redux';
import {AttackMonsters} from './encounter/AttackMonsters';

const preloadedState: State = {players: {}};
const store = createStore(reducer, preloadedState);

export const Player: FC = () => {
    const {path} = useRouteMatch();
    return (
        <StoreProvider store={store}>
            <SocketProvider>
                <PlayerIdProvider>
                    <Reducer>
                        <Switch>
                            <Route path={`${path}/stats`} component={ConfirmStats}/>
                            <Route path={`${path}/combat/attack`} component={AttackMonsters}/>
                            <Route path={`${path}/combat`} component={Encounter}/>
                            <Route path={'*'}>
                                <Redirect to={`${path}/stats`}/>
                            </Route>
                        </Switch>
                    </Reducer>
                </PlayerIdProvider>
            </SocketProvider>
        </StoreProvider>
    );
};
