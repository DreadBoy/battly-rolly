import Koa from 'koa';
import Logger from 'koa-logger';
import {logger} from '../logger';
import mount from 'koa-mount';
import {createServer} from 'http';
import {green} from 'chalk';
import {createSockets} from '../service/socket';
import {api} from '../api';
import {landing} from '../landing';
import {app as critHitApp} from '../app';

export function startServer(): void {

    const app = new Koa();

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
    app.use(mount('/api', api()));
    critHitApp(app);
    app.use(mount('/', landing()));

    const server = createServer(app.callback());
    createSockets(server);

    const port = process.env.PORT || 3000;
    server.listen(port);
    logger.info(green(`Server listening on port ${port}`));
}
