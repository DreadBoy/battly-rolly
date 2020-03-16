import React, {FC} from 'react';
import {BackendProvider} from './helpers/BackendProvider';
import {PlayerIdProvider} from './helpers/PlayerId';
import {StoreProvider} from './helpers/StoreProvider';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {CampaignList} from './campaign/CampaignList';
import {CampaignCreate} from './campaign/CampaignCreate';

export const V2: FC = () => {
    const {path} = useRouteMatch();
    return (
        <BackendProvider>
            <StoreProvider>
                <PlayerIdProvider>
                    <Switch>
                        <Route path={`${path}/campaign/edit`} component={CampaignCreate}/>
                        <Route path={`${path}/campaign`} component={CampaignList}/>
                        <Route path={'*'}><Redirect to={`${path}/campaign`}/></Route>
                    </Switch>
                </PlayerIdProvider>
            </StoreProvider>
        </BackendProvider>
    );
};
