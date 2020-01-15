import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Gm} from './gm/Gm';
import {Player} from './player/Player';
import {SelectRole} from './SelectRole';

const useStyles = createUseStyles({
    '@global': {
        '*': {
            boxSizing: 'border-box',
        },
    },
});

const App: FC = () => {
    const classes = useStyles();
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
};

export default App;
