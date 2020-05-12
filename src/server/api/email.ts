import Koa from 'koa';
import Router from '@koa/router';
import {AuthenticatedUser} from '../middlewares/authenticate';

const router = new Router<AuthenticatedUser>();

router.post('/test', async ctx => {
    // ctx.body = await confirmEmail(ctx.state.user);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
