import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {TouchProvider} from './elements/touch';
import {GlobalStoreProvider} from './helpers/GlobalStore';
import {ServiceWorkerProvider} from './hooks/use-service-worker';
import {app, App} from './App';
import {Landing} from './landing/Landing';
import {FourOhFour} from './layout/404';
import {About} from './landing/About';
import {UpdateButton} from './layout/UpdateButton';

const useStyles = createUseStyles({
    '@global': {
        'html': {
            boxSizing: 'border-box',
        },
        '.ui.search.dropdown .menu': {
            '@media only screen and (min-height: 992px)': {
                maxHeight: '21.37142857rem',
            },
            '@media only screen and (min-height: 768px)': {
                maxHeight: '16.02857143rem',
            },
            '@media only screen and (min-width: 768px)': {
                maxHeight: '10.68571429rem',
            },
            '@media only screen and (max-height: 767px)': {
                maxHeight: '8.01428571rem',
            },
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
                            <Route path={'/about'} component={About}/>
                            <Route path={'/'} exact component={Landing}/>
                            <Route path={'*'} component={FourOhFour}/>
                            <UpdateButton/>
                        </Switch>
                    </TouchProvider>
                </BrowserRouter>
            </GlobalStoreProvider>
        </ServiceWorkerProvider>
    );
};

export default Main;

