import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Gm} from './gm/Gm';
import {Player} from './player/Player';
import {SelectRole} from './SelectRole';
import {FullScreen} from './common/Fullscreen';
import {TouchProvider} from './common/touch';

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
                <FullScreen>
                    <Switch>
                        <Route path="/gm" component={Gm}/>
                        <Route path="/player" component={Player}/>
                        <Route path="*" component={SelectRole}/>
                    </Switch>
                </FullScreen>
            </TouchProvider>
        </BrowserRouter>
    );
};

export default App;
