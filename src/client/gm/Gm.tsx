import React, {FC} from 'react';
import {Claim} from './Claim';
import {useSocket} from '../common/Socket';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {Header} from 'semantic-ui-react';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';

export const Gm: FC = () => {
    const {path} = useRouteMatch();
    const {claimed} = useSocket();
    if (!claimed)
        return <Claim/>;
    console.log('GM', claimed);
    return (
        <Switch>
            <Route path={`${path}/battle`}>
                <Splash bg={bg} position={'88% center'}>
                    <Header as='h1'>Battle</Header>
                </Splash>
            </Route>
            <Route path={'*'}>
                <Redirect to={`${path}/battle`}/>
            </Route>
        </Switch>
    );
};
