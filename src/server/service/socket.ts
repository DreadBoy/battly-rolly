import {Socket} from 'socket.io';
import {intersection} from 'lodash';

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

export function broadcastEvent(event: string, data: any, users: string[]) {
    const targetUsers = intersection(Object.keys(sockets), users);
    const state = !data ? 'null' : JSON.stringify(data);
    return targetUsers.forEach(id => {
        sockets[id].emit(event, state);
        cache[id] = cache[id] || {};
        cache[id][event] = state;
    });
}

export function repeatEvent(userId: string, event: string) {
    if (!cache[userId] || !cache[userId][event])
        return;
    sockets[userId].emit(event, cache[userId][event]);
}
