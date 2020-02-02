import {cloneDeep, find} from 'lodash';
import {AttackLog, Encounter, isMissedAttackLog, Player} from './encounter';
import {isAttack, isFinishEncounter, isQueueAction, isResolveQueue, isSetStats, isStartEncounter} from './actions';

export type State = {
    players: {
        [id: string]: Player
    },
    encounter?: Encounter,
}

export type Action = {
    type: string;
}

export function reducer(state: State = {players: {}}, action: Action) {
    switch (action.type) {
        case 'SET STATE':
            // @ts-ignore
            return action.payload;
        case 'SET PHASE':
            if (!state.encounter)
                return state;
            return {
                ...state,
                encounter: {
                    ...state.encounter,
                    // @ts-ignore
                    phase: action.payload,
                },
            };
        case 'CONNECT':
            return {
                ...state,
                players: {
                    ...state.players,
                    // @ts-ignore
                    [action.payload.id]: action.payload.data,
                },
            };
        case 'DISCONNECT':
            const players = {
                ...state.players,
            };
            // @ts-ignore
            delete players[action.payload];
            return {
                ...state,
                players,
            };
    }

    if (isStartEncounter(action)) {
        if (state.encounter)
            return state;
        return {
            ...state,
            encounter: action.payload,
        };
    }
    if (isFinishEncounter(action)) {
        if (!state.encounter)
            return state;
        return {
            ...state,
            encounter: undefined,
        };
    }
    if (isAttack(action)) {
        if (!state.encounter)
            return state;
        const {playerId, log} = action.payload;
        const state1 = cloneDeep(state);
        state1.players[playerId].actionLog = state1.players[playerId].actionLog || [];
        state1.players[playerId].actionLog.push(log);
        return state1;
    }
    if (isSetStats(action)) {
        const {playerId, ...stats} = action.payload;
        const state1 = cloneDeep(state);
        state1.players[playerId].stats = stats;
        return state1;
    }
    if (isQueueAction(action)) {
        if (!state.encounter)
            return;
        const state1 = cloneDeep(state);
        action.payload.forEach(log => {
            const monster = find(state1.encounter?.monsters, ['id', log.monsterId]);
            if (!monster)
                return;
            monster.actionLog = monster.actionLog || [];
            monster.actionLog.concat(log);
        });
        return state1;
    }
    if (isResolveQueue(action)) {
        if (!state.encounter)
            return;
        const state1 = cloneDeep(state);
        state1.encounter?.monsters.forEach(m => {
            if (m.actionLog.length === 0)
                return;
            m.actionLog.forEach(al => {
                if (isMissedAttackLog(al))
                    return;
                // TODO account for damage immunity/resistance
                m.currentHP -= (al as AttackLog).damage;
            })
        });
        return state1;
    }

    return state;
}
