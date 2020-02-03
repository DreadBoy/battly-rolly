import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Gm} from './gm/Gm';
import {Player} from './player/Player';
import {SelectRole} from './SelectRole';
import {FullScreen} from './common/Fullscreen';

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
            <FullScreen>
                <Switch>
                    <Route path="/gm" component={Gm}/>
                    <Route path="/player" component={Player}/>
                    <Route path="*" component={SelectRole}/>
                </Switch>
            </FullScreen>
        </BrowserRouter>
    );
};

export default App;
