import Koa from 'koa';
import Io from 'socket.io'
import {createServer} from 'http';
import KoaStatic from 'koa-static-server';
import {green, magenta} from 'chalk';
import {errorMiddleware} from './middlewares/error-middleware';
import {ensureDatabase} from './middlewares/ensure-database';
import {app as probeApi} from './api/probe';
import {app as userApi} from './api/user';
import {app as campaignApi} from './api/campaign';
import {app as encounterApi} from './api/encounter';
import {addSocket, removeSocket} from './service/socket';

const mount = require('koa-mount');

const app = new Koa();
const koaStatic = KoaStatic({
    rootDir: __dirname,
    notFoundFile: 'index.html',
});

app.use(async (ctx, next) => {
    console.log(magenta(`> ${ctx.path}`));
    await next();
});
app.use(errorMiddleware);
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
});
app.use(ensureDatabase);
app.use(mount('/user', userApi));
app.use(mount('/campaign', campaignApi));
app.use(mount('/encounter', encounterApi));
app.use(mount(probeApi));
app.use(koaStatic);

const server = createServer(app.callback());
const io = Io(server);

io.on('connect', socket => {
    let connectedUser: string | null = null;

    socket.on('join', (userId: string) => {
        console.log('connected', userId);
        connectedUser = userId;
        addSocket(userId, socket);
    });

    socket.on('disconnect', () => {
        console.log('disconnected', connectedUser);
        if (connectedUser != null)
            removeSocket(connectedUser);
    });
});

const port = process.env.PORT || 3000;
server.listen(port);
console.log(green(`Server listening on port ${port}`));
