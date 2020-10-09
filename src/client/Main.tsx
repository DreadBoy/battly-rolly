import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {TouchProvider} from './elements/touch';
import {BackendProvider} from './helpers/BackendProvider';
import {GlobalStoreProvider} from './helpers/GlobalStore';
import {ServiceWorkerProvider} from './hooks/use-service-worker';
import {app, App} from './App';
import {HomepageHeading} from './landing/Landing';

const useStyles = createUseStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
        },
    },
});

const Main: FC = () => {
    useStyles();
    return (
        <ServiceWorkerProvider>
            <GlobalStoreProvider>
                <BrowserRouter>
                    <TouchProvider>
                        <Switch>
                            <Route path={app('')} component={App}/>
                            <Route path={'/'} component={HomepageHeading}/>
                        </Switch>
                    </TouchProvider>
                </BrowserRouter>
            </GlobalStoreProvider>
        </ServiceWorkerProvider>
    );
};

export default Main;

