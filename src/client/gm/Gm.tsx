import React, {FC} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router';
import {Encounter} from './Encounter';
import {Reducer} from './Reducer';
import {SocketProvider} from '../common/Socket';
import {createStore} from 'redux';
import {reducer, State} from '../common/reducer';
import {Provider as StoreProvider} from 'react-redux';
import {fakeMonster} from './faker';
import {AttackLog} from '../common/encounter';

// const preloadedState: State = {
//     players: {},
//     encounter: undefined,
// };
const m = fakeMonster();
m.actionLog = [{
    attackerId: '557912',
    targetId: m.id,
    attack: {
        type: 'attack',
        name: 'mock_attack',
        damage: {damageType: 'bludgeoning', rolls: [[1, 4, 0]]},
        modifier: 5,
    },
    hitRoll: 16,
    damageRoll: 4,
    success: true,
} as AttackLog];
const preloadedState: State = {
    players: {
        '557912': {
            stats: {
                name: 'Matic',
                AC: 15,
                passivePerception: 15,
            },
            actionLog: [],
        },
    },
    encounter: {
        'monsters': [m],
        'phase': 0,
    },
};
const store = createStore(reducer, preloadedState);

export const Gm: FC = () => {
    const {path} = useRouteMatch();
    return (
        <StoreProvider store={store}>
            <SocketProvider>
                <Reducer>
                    <Switch>
                        <Route path={`${path}/encounter`}>
                            <Encounter/>
                        </Route>
                        <Route path={'*'}>
                            <Redirect to={`${path}/encounter`}/>
                        </Route>
                    </Switch>
                </Reducer>
            </SocketProvider>
        </StoreProvider>
    );
};
