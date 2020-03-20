import {Socket} from 'socket.io';
import {intersection} from 'lodash';
import {Encounter} from '../model/encounter';

type Sockets = {
    [userId: string]: Socket,
};
const sockets: Sockets = {};
export const cache: {
    [userId: string]: {
        [event: string]: any,
    },
} = {};

export function addSocket(userId: string, socket: Socket) {
    sockets[userId] = socket;
}

export function removeSocket(userId: string) {
    delete sockets[userId];
}

export function broadcastEncounter(encounter: Encounter, users: string[]) {
    const targetUsers = intersection(Object.keys(sockets), users);
    const state = !encounter.active ? 'null' : JSON.stringify(encounter);
    return targetUsers.forEach(id => {
        sockets[id].emit('encounter', state);
        cache[id] = cache[id] || {};
        cache[id]['encounter'] = state;
    });
}

export function repeatEvent(userId: string, event: string) {
    if (!cache[userId] || !cache[userId][event])
        return;
    sockets[userId].emit(event, cache[userId][event]);
}
