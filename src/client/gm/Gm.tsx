import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {Encounter} from './Encounter';
import {Reducer} from './Reducer';
import {SocketProvider} from '../common/Socket';

export const Gm: FC = () => {
    const {path} = useRouteMatch();
    return (
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
    );
};
