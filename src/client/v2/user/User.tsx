import React, {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router';
import {UserEdit} from './UserEdit';
import {FourOhFour} from '../404';

export const User: FC = () => {
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/:userId/edit`} component={UserEdit}/>
            <Route path={'*'} component={FourOhFour}/>
        </Switch>
    );
};
