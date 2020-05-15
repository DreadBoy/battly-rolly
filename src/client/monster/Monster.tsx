import React, {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router';
import {MonsterList} from './MonsterList';

export const Monster: FC = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}`} component={MonsterList}/>
        </Switch>
    );
};
