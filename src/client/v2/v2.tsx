import React, {FC} from 'react';
import {BackendProvider} from './helpers/BackendProvider';
import {PlayerIdProvider} from './helpers/PlayerId';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {CampaignEdit} from './campaign/CampaignEdit';
import {CampaignView} from './campaign/CampaignView';
import {CampaignList} from './campaign/CampaignList';
import {EncounterEdit} from './encounter/EncounterEdit';
import {UserEdit} from './user/UserEdit';

export const V2: FC = () => {
    const {path} = useRouteMatch();
    return (
        <BackendProvider>
            <PlayerIdProvider>
                <Switch>
                    <Route path={`${path}/campaign/edit`} component={CampaignEdit}/>
                    <Route path={`${path}/campaign/:id/edit`} component={CampaignEdit}/>
                    <Route path={`${path}/campaign/:id`} component={CampaignView}/>
                    <Route path={`${path}/campaign`} component={CampaignList}/>
                    <Route path={`${path}/encounter/:id`} component={EncounterEdit}/>
                    <Route path={`${path}/user/:id/edit`} component={UserEdit}/>
                    <Route path={'*'}><Redirect to={`${path}/campaign`}/></Route>
                </Switch>
            </PlayerIdProvider>
        </BackendProvider>
    );
};
