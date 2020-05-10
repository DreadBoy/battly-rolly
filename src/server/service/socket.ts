import Io, {Socket} from 'socket.io';
import {intersection} from 'lodash';
import {gray, green, red, white} from 'chalk';
import {Server} from 'http';
import SocketIO from 'socket.io';

type Sockets = {
    [userId: string]: Socket,
};
const sockets: Sockets = {};
export const cache: {
    [userId: string]: {
        [event: string]: any,
    },
} = {};

let io: SocketIO.Server;

export function createSockets(server: Server) {
    io = Io(server);
    io.on('connect', socket => {
        let connectedUser: string | null = null;
        console.log(`  ${green('<--')} ${white('SOCKET ')}`);

        socket.on('join', (userId: string) => {
            console.log(`  ${gray('<--')} ${white('SOCKET')} ${gray('join')} ${gray(userId)}`);
            connectedUser = userId;
            sockets[userId] = socket;
        });

        socket.on('repeat', (event: string) => {
            if (!connectedUser)
                return;
            console.log(`  ${gray('<--')} ${white('SOCKET')} ${gray('repeat')} ${gray(event)}`);
            repeatEvent(connectedUser, event);
        });

        socket.on('disconnect', () => {
            console.log(`  ${red('-->')} ${white('SOCKET ')} ${gray(connectedUser)}`);
            if (connectedUser != null)
                delete sockets[connectedUser];
        });
    });
    return io;
}

export function broadcastEvent(event: string, data: any, users: string[]) {
    const targetUsers = intersection(Object.keys(sockets), users);
    const state = !data ? 'null' : JSON.stringify(data);
    console.log(`  ${gray('<--')} ${white('SOCKET')} ${gray('event')} ${gray(event)}`);
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
