import Koa from 'koa';
import Logger from 'koa-logger';
import {logger} from './logger';
import bodyParser from 'koa-bodyparser';
import koaSsl, {xForwardedProtoResolver} from 'koa-sslify'
import mount from 'koa-mount';
import {createServer} from 'http';
import KoaStatic from 'koa-static-server';
import {green} from 'chalk';
import {errorMiddleware} from './middlewares/error-middleware';
import {connectDB} from './middlewares/ensure-database';
import {app as probeApi} from './api/probe';
import {app as authApi} from './api/auth';
import {app as userApi} from './api/user';
import {app as campaignApi} from './api/campaign';
import {app as encounterApi} from './api/encounter';
import {app as featureApi} from './api/feature';
import {app as logApi} from './api/log';
import {app as monsterApi} from './api/monster';
import {app as emailApi} from './api/email';
import {createSockets} from './service/socket';

const app = new Koa();
const koaStatic = KoaStatic({
    rootDir: __dirname,
    notFoundFile: 'index.html',
});

app.use(errorMiddleware);
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    if (ctx.method.toLowerCase() === 'options')
        return ctx.status = 204;
    await next();
});
app.use(Logger({
    transporter: (str) => {
        logger.info(str);
    },
}));
if (process.env.NODE_ENV !== 'development')
    app.use(koaSsl({resolver: xForwardedProtoResolver}));
app.use(bodyParser());
app.use(mount('/api/auth', authApi));
app.use(mount('/api/user', userApi));
app.use(mount('/api/campaign', campaignApi));
app.use(mount('/api/encounter', encounterApi));
app.use(mount('/api/feature', featureApi));
app.use(mount('/api/log', logApi));
app.use(mount('/api/monster', monsterApi));
app.use(mount('/api/email', emailApi));
app.use(mount('/api/probe', probeApi));
app.use(koaStatic);

connectDB().then(() => {
    const server = createServer(app.callback());
    createSockets(server);

    const port = process.env.PORT || 3000;
    server.listen(port);
    logger.info(green(`Server listening on port ${port}`));
}).catch(e => {
    console.error(e);
    process.exit(1);
});
