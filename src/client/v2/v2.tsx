import React, {FC} from 'react';
import {BackendProvider} from './helpers/BackendProvider';
import {PlayerIdProvider} from './helpers/PlayerId';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {Campaign} from './campaign/Campaign';
import {User} from './user/User';
import {Register} from './user/Register';

export const V2: FC = () => {
    const {path} = useRouteMatch();
    return (
        <BackendProvider>
            <Switch>
                <Route path={`${path}/register`} component={Register}/>
                <Route path={`${path}/campaign`}>
                    <PlayerIdProvider>
                        <Campaign/>
                    </PlayerIdProvider>
                </Route>
                <Route path={`${path}/user`}>
                    <PlayerIdProvider>
                        <User/>
                    </PlayerIdProvider>
                </Route>
                <Route path={'*'}> <Redirect to={`${path}/campaign`}/> </Route>
            </Switch>
        </BackendProvider>
    );
};

export function root(path: string = '/') {
    if (!path.startsWith('/'))
        throw new Error('Path need to start with forward slash!');
    return `/v2${path}`
}
