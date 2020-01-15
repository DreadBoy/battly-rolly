import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Gm} from './gm/Gm';
import {Player} from './player/Player';
import {SelectRole} from './SelectRole';
import {Provider} from 'react-redux'
import {createStore} from 'redux';
import {reducer} from './common/reducer';

const useStyles = createUseStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
        },
    },
});

const store = createStore(reducer);

const App: FC = () => {
    useStyles();
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Switch>
                    <Route path="/gm">
                        <Gm/>
                    </Route>
                    <Route path="/player">
                        <Player/>
                    </Route>
                    <Route path="*">
                        <SelectRole/>
                    </Route>
                </Switch>
            </Provider>
        </BrowserRouter>
    );
};

export default App;
