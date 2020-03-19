import React, {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router';
import {EncounterEdit} from './EncounterEdit';

export const Encounter: FC = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/create`} component={EncounterEdit}/>
            <Route exact path={`${path}/:encounterId/edit`} component={EncounterEdit}/>
        </Switch>
    );
};
