import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {ConfirmStats} from './ConfirmStats';

export const Player: FC = () => {
    const {path} = useRouteMatch();
    return <Switch>
        <Route path={`${path}/stats`}>
            <ConfirmStats/>
        </Route>
        <Route path={'*'}>
            <Redirect to={`${path}/stats`}/>
        </Route>
    </Switch>
};
