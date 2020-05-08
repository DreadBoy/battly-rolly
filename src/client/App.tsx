import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {TouchProvider} from './elements/touch';
import {BackendProvider} from './helpers/BackendProvider';
import {PlayerIdProvider} from './helpers/PlayerId';
import {Register} from './user/Register';
import {Campaign} from './campaign/Campaign';
import {User} from './user/User';
import {Redirect} from 'react-router';

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
        <BrowserRouter>
            <TouchProvider>
                <BackendProvider>
                    <PlayerIdProvider>
                        <Switch>
                            <Route path={`/register`} component={Register}/>
                            <Route path={`/campaign`} component={Campaign}/>
                            <Route path={`/user`} component={User}/>
                            <Route path={'*'}> <Redirect to={`/campaign`}/> </Route>
                        </Switch>
                    </PlayerIdProvider>
                </BackendProvider>
            </TouchProvider>
        </BrowserRouter>
    );
};

export default App;

export function root(path: string = '/') {
    if (!path.startsWith('/'))
        throw new Error('Path need to start with forward slash!');
    return path;
}
