import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import Io from 'socket.io'
import {createServer} from 'http';
import KoaStatic from 'koa-static-server';
import {gray, green, red, white} from 'chalk';
import {errorMiddleware} from './middlewares/error-middleware';
import {ensureDatabase} from './middlewares/ensure-database';
import {app as probeApi} from './api/probe';
import {app as authApi} from './api/auth';
import {app as userApi} from './api/user';
import {app as campaignApi} from './api/campaign';
import {app as encounterApi} from './api/encounter';
import {app as featureApi} from './api/feature';
import {app as logApi} from './api/log';
import {app as monsterApi} from './api/monster';
import {addSocket, removeSocket, repeatEvent} from './service/socket';
import {configureJWT} from './auth';

const app = new Koa();
const koaStatic = KoaStatic({
    rootDir: __dirname,
    notFoundFile: 'index.html',
});
configureJWT();

app.use(errorMiddleware);
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    if (ctx.method.toLowerCase() === 'options')
        return ctx.status = 204;
    await next();
});
app.use(logger());
app.use(bodyParser());
app.use(ensureDatabase);
app.use(mount('/api/auth', authApi));
app.use(mount('/api/user', userApi));
app.use(mount('/api/campaign', campaignApi));
app.use(mount('/api/encounter', encounterApi));
app.use(mount('/api/feature', featureApi));
app.use(mount('/api/log', logApi));
app.use(mount('/api/monster', monsterApi));
app.use(mount(probeApi));
app.use(koaStatic);

const server = createServer(app.callback());
const io = Io(server);

io.on('connect', socket => {
    let connectedUser: string | null = null;

    socket.on('join', (userId: string) => {
        console.log(green('  <-- ') + white('SOCKET ') + gray(userId));
        connectedUser = userId;
        addSocket(userId, socket);
    });

    socket.on('repeat', (event: string) => {
        if (!connectedUser)
            return;
        console.log(`  ${gray('<--')} ${white('SOCKET')} ${gray('repeat')} ${gray(event)}`);
        repeatEvent(connectedUser, event);
    });

    socket.on('disconnect', () => {
        console.log(red('  --> ') + white('SOCKET ') + gray(connectedUser));
        if (connectedUser != null)
            removeSocket(connectedUser);
    });
});

const port = process.env.PORT || 3000;
server.listen(port);
console.log(green(`Server listening on port ${port}`));
