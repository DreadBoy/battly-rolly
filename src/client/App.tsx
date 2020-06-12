import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {Redirect} from 'react-router';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {TouchProvider} from './elements/touch';
import {BackendProvider} from './helpers/BackendProvider';
import {PlayerIdProvider} from './helpers/PlayerId';
import {ResetPassword} from './email/ResetPassword';
import {Register} from './user/Register';
import {Campaign} from './campaign/Campaign';
import {Monster} from './monster/Monster';
import {User} from './user/User';
import {GlobalStoreProvider} from './helpers/GlobalStore';

const useStyles = createUseStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
        },
    },
});

const App: FC = () => {
    useStyles();
    return (
        <GlobalStoreProvider>
            <BrowserRouter>
                <TouchProvider>
                    <BackendProvider>
                        <Switch>
                            <Route path={`/reset-password`} component={ResetPassword}/>
                            <Route path={'*'}>
                                <PlayerIdProvider>
                                    <Switch>
                                        <Route path={`/register`} component={Register}/>
                                        <Route path={`/campaign`} component={Campaign}/>
                                        <Route path={`/monster`} component={Monster}/>
                                        <Route path={`/user`} component={User}/>
                                        <Route path={'*'}> <Redirect to={`/campaign`}/> </Route>
                                    </Switch>
                                </PlayerIdProvider>
                            </Route>
                        </Switch>
                    </BackendProvider>
                </TouchProvider>
            </BrowserRouter>
        </GlobalStoreProvider>
    );
};

export default App;

export function root(path: string = '/') {
    if (!path.startsWith('/'))
        throw new Error('Path need to start with forward slash!');
    return path;
}
