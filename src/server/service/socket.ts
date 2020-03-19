import {Socket} from 'socket.io';
import {intersection} from 'lodash';
import {Encounter} from '../model/encounter';

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

export function broadcastEncounter(encounter: Encounter, users: string[]) {
    const targetUsers = intersection(Object.keys(sockets), users);
    if (!encounter.active)
        return targetUsers.forEach(id => sockets[id].emit('encounter', 'null'));
    const state = JSON.stringify(encounter);
    targetUsers.forEach(id => sockets[id].emit('encounter', state));
}
