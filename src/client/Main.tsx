import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {TouchProvider} from './elements/touch';
import {GlobalStoreProvider} from './helpers/GlobalStore';
import {ServiceWorkerProvider} from './hooks/use-service-worker';
import {app, App} from './App';
import {Landing} from './landing/Landing';
import {FourOhFour} from './layout/404';
import {Page} from './layout/Page';

const useStyles = createUseStyles({
    '@global': {
        'html': {
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
                            <Route path={'/about'} component={Page}/>
                            <Route path={'/'} exact component={Landing}/>
                            <Route path={'*'} component={FourOhFour}/>
                        </Switch>
                    </TouchProvider>
                </BrowserRouter>
            </GlobalStoreProvider>
        </ServiceWorkerProvider>
    );
};

export default Main;

