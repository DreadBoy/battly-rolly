import Koa from 'koa';
import Router from '@koa/router';
import {AuthenticatedUser} from '../middlewares/authenticate';
import {send} from '../service/email';

const router = new Router<AuthenticatedUser>();

router.post('/test', async ctx => {
    ctx.body = await send();
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
