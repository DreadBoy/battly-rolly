import React, {FC} from 'react';
import {BackendProvider} from './helpers/BackendProvider';
import {PlayerIdProvider} from './helpers/PlayerId';
import {StoreProvider} from './helpers/StoreProvider';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {CampaignEdit} from './campaign/CampaignEdit';
import {CampaignView} from './campaign/CampaignView';
import {CampaignList} from './campaign/CampaignList';
import {UserEdit} from './user/UserEdit';

export const V2: FC = () => {
    const {path} = useRouteMatch();
    return (
        <BackendProvider>
            <StoreProvider>
                <PlayerIdProvider>
                    <Switch>
                        <Route path={`${path}/campaign/edit`} component={CampaignEdit}/>
                        <Route path={`${path}/campaign/:id/edit`} component={CampaignEdit}/>
                        <Route path={`${path}/campaign/:id`} component={CampaignView}/>
                        <Route path={`${path}/campaign`} component={CampaignList}/>
                        <Route path={`${path}/user/:id/edit`} component={UserEdit}/>
                        <Route path={'*'}><Redirect to={`${path}/campaign`}/></Route>
                    </Switch>
                </PlayerIdProvider>
            </StoreProvider>
        </BackendProvider>
    );
};
