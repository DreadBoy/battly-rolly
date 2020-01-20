import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {ConfirmStats} from './ConfirmStats';
import {Reducer} from './Reducer';
import {PlayerIdProvider} from './PlayerId';
import {SocketProvider} from '../common/Socket';
import {Encounter} from './Encounter';

export const Player: FC = () => {
    const {path} = useRouteMatch();
    return (
        <SocketProvider>
            <PlayerIdProvider>
                <Reducer>
                    <Switch>
                        <Route path={`${path}/stats`}>
                            <ConfirmStats/>
                        </Route>
                        <Route path={`${path}/combat`}>
                            <Encounter/>
                        </Route>
                        <Route path={'*'}>
                            <Redirect to={`${path}/stats`}/>
                        </Route>
                    </Switch>
                </Reducer>
            </PlayerIdProvider>
        </SocketProvider>
    );
};
