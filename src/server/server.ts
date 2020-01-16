import Koa from 'koa';
import Router from '@koa/router';
import Io from 'socket.io'
import {createServer} from 'http';

const app = new Koa();
const router = new Router();

router.get('/probe', ctx => ctx.response.status = 200);

app
    .use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await next();
    })
    .use(router.routes())
    .use(router.allowedMethods())
;

const server = createServer(app.callback());
const io = Io(server);

let gm: Io.Socket | null = null;
io.on('connect', socket => {
    console.log('someone connected');

    socket.on('disconnect', () => {
        console.log('someone disconnected');
        if (socket === gm)
            gm = null;
    });
    socket.on('claim', (cb: Function) => {
        if (gm) {
            console.log('someone wrongfully claimed GM\'s role');
            return;
        }
        console.log('someone claimed GM\'s role');
        gm = socket;
        cb(true);
    });
    socket.on('action', action => {
        if (gm !== null)
            gm.emit('action', action);
    });
    socket.on('state', state => {
        if (socket !== gm)
            return;
        socket.broadcast.emit('state', state);
    })
});
server.listen(3000);
