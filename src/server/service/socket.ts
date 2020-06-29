import Io from 'socket.io';
import SocketIO from 'socket.io';
import {gray, green, red, white} from 'chalk';
import {Server} from 'http';
import {logger} from '../logger';
import {notifyUserOfActiveEncounter} from './encounter';

let io: SocketIO.Server;

export function createSockets(server: Server) {
    io = Io(server);
    io.on('connect', socket => {
        let connectedUser: string | null = null;
        logger.info(`  ${green('<--')} ${white('SOCKET ')}`);

        socket.on('join', (userId: string) => {
            // TODO add auth to this method
            // https://gist.github.com/naoki-sawada/2f4e135feb3c6bad7f555f59dfb40020
            logger.info(`  ${gray('<--')} ${white('SOCKET')} ${gray('join')} ${gray(userId)}`);
            connectedUser = userId;
            socket.join(userId);
            notifyUserOfActiveEncounter(userId).catch(e => console.error(e));
        });

        socket.on('disconnect', () => {
            logger.info(`  ${red('-->')} ${white('SOCKET ')} ${gray(connectedUser)}`);
        });
    });
    return io;
}

export type BroadcastObject = {
    model: string,
    data: any | null
}

export function broadcastObject(model: string, data: any | null, users: string[]) {
    logger.info(`  ${gray('<--')} ${white('SOCKET')} ${gray('state')} ${gray(data?.id)}`);
    return users.forEach(id => {
        io.to(id).emit('object', {
            model,
            data,
        } as BroadcastObject);
    });
}
