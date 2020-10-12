import React, {FC} from 'react';
import {Redirect, useRouteMatch} from 'react-router';
import {Route, Switch} from 'react-router-dom';
import {PlayerIdProvider} from './helpers/PlayerId';
import {ResetPassword} from './email/ResetPassword';
import {Register} from './user/Register';
import {Campaign} from './campaign/Campaign';
import {Monster} from './monster/Monster';
import {User} from './user/User';
import {BackendProvider} from './helpers/BackendProvider';
import {FourOhFour} from './layout/404';

export const App: FC = () => {
    const {path} = useRouteMatch();
    return (
        <BackendProvider>
            <Switch>
                <Route path={`${path}/reset-password`} component={ResetPassword}/>
                <Route path={path}>
                    <PlayerIdProvider>
                        <Switch>
                            <Route path={`${path}/register`} component={Register}/>
                            <Route path={`${path}/campaign`} component={Campaign}/>
                            <Route path={`${path}/monster`} component={Monster}/>
                            <Route path={`${path}/user`} component={User}/>
                            <Route path={path} exact={true}>
                                <Redirect to={app(`/campaign`)}/>
                            </Route>
                            <Route path={`*`} component={FourOhFour}/>
                        </Switch>
                    </PlayerIdProvider>
                </Route>
            </Switch>
        </BackendProvider>
    );
};

export function app(path: string = '') {
    if (path.length > 0 && !path.startsWith('/'))
        throw new Error('Path need to start with forward slash!');
    return `/app${path}`;
}
