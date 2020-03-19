import React, {FC} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router';
import {CampaignEdit} from './CampaignEdit';
import {CampaignView} from './CampaignView';
import {CampaignList} from './CampaignList';
import {Encounter} from '../encounter/Encounter';

export const Campaign: FC = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}`} component={CampaignList}/>
            <Route exact path={`${path}/create`} component={CampaignEdit}/>
            <Route exact path={`${path}/:campaignId`} component={CampaignView}/>
            <Route exact path={`${path}/:campaignId/edit`} component={CampaignEdit}/>
            <Route path={`${path}/:campaignId/encounter`} component={Encounter}/>
        </Switch>
    );
};
