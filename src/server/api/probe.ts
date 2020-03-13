import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';

const router = new Router<AuthenticatedUser>();

router.get('/probe', authenticate, async ctx => {
    ctx.response.status = 200;
    ctx.body = ctx.state.user.id;
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
