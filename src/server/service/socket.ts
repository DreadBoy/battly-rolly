import {Socket} from 'socket.io';
import {intersection} from 'lodash';

type Sockets = {
    [userId: string]: Socket,
};
const sockets: Sockets = {};

export function addSocket(userId: string, socket: Socket) {
    sockets[userId] = socket;
}

export function removeSocket(userId: string) {
    delete sockets[userId];
}

export function broadcastEncounter(state: string, ...userIds: string[]) {
    intersection(Object.keys(sockets), userIds).forEach(id => sockets[id].emit('encounter', state));
}
