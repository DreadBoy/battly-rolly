import Koa from 'koa';
import Router from '@koa/router';
import Io from 'socket.io'
import {createServer} from 'http';
import KoaStatic from 'koa-static-server';

const app = new Koa();
const router = new Router();
const koaStatic = KoaStatic({
    rootDir: __dirname,
    notFoundFile: 'index.html',
});

router.get('/probe', ctx => ctx.response.status = 200);

app
    .use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await next();
    })
    .use(router.routes())
    .use(router.allowedMethods())
    .use(koaStatic)
;

const server = createServer(app.callback());
const io = Io(server);

let gm: Io.Socket | null = null;
let cachedState: any | null = null;
io.on('connect', socket => {
    console.log('connected');
    let playerId: string | null = null;

    socket.on('disconnect', () => {
        console.log('disconnected', playerId);
        if (socket === gm)
            gm = null;
        if (playerId !== null) {
            gm?.emit('action', {type: 'DISCONNECT', payload: playerId});
            playerId = null;
        }
    });
    socket.on('claim', (cb: Function) => {
        if (gm) {
            console.log('GM\'s role wrongfully claimed');
            return;
        }
        console.log('GM\'s role claimed');
        gm = socket;
        cb(true);
    });
    socket.on('join', (id: string, cb: Function) => {
        if (!gm)
            return cb(false);
        console.log('player joined', id);
        if (cachedState !== null)
            socket.emit('state', cachedState);
        gm?.emit('action', {type: 'CONNECT', payload: {id, data: {}}});
        playerId = id;
        cb(true);
    });
    socket.on('action', action => {
        if (gm === null)
            return;
        console.log('Action:', JSON.stringify(action));
        action.payload.playerId = playerId;
        gm.emit('action', action);
    });
    socket.on('state', state => {
        if (socket !== gm)
            return;
        console.log('State:', JSON.stringify(state));
        cachedState = state;
        socket.broadcast.emit('state', state);
    })
});
server.listen(3000);
