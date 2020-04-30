import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {login, logout, register} from '../service/auth';

const router = new Router<AuthenticatedUser>();

router.post('/', async ctx => {
    ctx.body = await register(ctx.request.body);
});

router.put('/', async ctx => {
    ctx.body = await login(ctx.request.body);
});

router.delete('/', authenticate, async ctx => {
    ctx.body = await logout(ctx.state.user);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
