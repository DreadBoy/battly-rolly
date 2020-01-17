import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {Combat} from './Combat';
import {Reducer} from './Reducer';

export const Gm: FC = () => {
    const {path} = useRouteMatch();
    return (
        <Reducer>
            <Switch>
                <Route path={`${path}/combat`}>
                    <Combat/>
                </Route>
                <Route path={'*'}>
                    <Redirect to={`${path}/combat`}/>
                </Route>
            </Switch>
        </Reducer>
    );
};
