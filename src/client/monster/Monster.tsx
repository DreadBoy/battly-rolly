import React, {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router';
import {MonsterEdit} from './MonsterEdit';
import {MonsterList} from './MonsterList';

export const Monster: FC = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}`} component={MonsterList}/>
            <Route exact path={`${path}/create`} component={MonsterEdit}/>
            <Route exact path={`${path}/:monsterId/edit`} component={MonsterEdit}/>
        </Switch>
    );
};
