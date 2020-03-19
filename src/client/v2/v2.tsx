import React, {FC} from 'react';
import {BackendProvider} from './helpers/BackendProvider';
import {PlayerIdProvider} from './helpers/PlayerId';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {UserEdit} from './user/UserEdit';
import {Campaign} from './campaign/Campaign';

export const V2: FC = () => {
    const {path} = useRouteMatch();
    return (
        <BackendProvider>
            <PlayerIdProvider>
                <Switch>
                    <Route path={`${path}/campaign`} component={Campaign}/>
                    <Route path={`${path}/user/:userId/edit`} component={UserEdit}/>
                    <Route path={'*'}><Redirect to={`${path}/campaign`}/></Route>
                </Switch>
            </PlayerIdProvider>
        </BackendProvider>
    );
};
