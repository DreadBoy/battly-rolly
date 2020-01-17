import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {ConfirmStats} from './ConfirmStats';
import {Phase} from './Phase';
import {Reducer} from './Reducer';
import {PlayerIdProvider} from './PlayerId';

export const Player: FC = () => {
    const {path} = useRouteMatch();
    return (
        <PlayerIdProvider>
            <Reducer>
                <Switch>
                    <Route path={`${path}/stats`}>
                        <ConfirmStats/>
                    </Route>
                    <Route path={`${path}/phase`}>
                        <Phase/>
                    </Route>
                    <Route path={'*'}>
                        <Redirect to={`${path}/stats`}/>
                    </Route>
                </Switch>
            </Reducer>
        </PlayerIdProvider>
    );
};
