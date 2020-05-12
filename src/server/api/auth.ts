import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {flowWithEmail, forceLogout, login, refresh, register} from '../service/auth';
import {validateBody, validateQuery} from '../middlewares/validators';
import {findUserByEmail, updatePassword} from '../service/user';
import {HttpError} from '../middlewares/error-middleware';
import {resetPassword} from '../service/email';

const router = new Router<AuthenticatedUser>();

router.post('/', async ctx => {
    ctx.body = await register(ctx.request.body);
});

router.put('/', async ctx => {
    ctx.body = await login(ctx.request.body);
});

router.put('/refresh', async ctx => {
    ctx.body = await refresh(ctx.request.body);
});

router.delete('/', authenticate, async ctx => {
    ctx.body = await forceLogout(ctx.state.user);
});

router.delete('/reset-password', async ctx => {
    const email = validateQuery(ctx, 'email');
    let user = await findUserByEmail(email);
    user = await flowWithEmail('resetPassword').start(user)
    await resetPassword(user)
    ctx.body = {key: user.resetPassword};
});

router.post('/reset-password', async ctx => {
    const key = validateQuery(ctx, 'key');
    const valid = await flowWithEmail('resetPassword').verify(key);
    if (!valid)
        throw new HttpError(400, 'Invalid key!');
    ctx.status = 204;
});

router.put('/reset-password', async ctx => {
    const key = validateQuery(ctx, 'key');
    const {password} = validateBody(ctx, ['password']);
    const flow = flowWithEmail('resetPassword');
    let user = await flow.getUser(key);
    if (!user)
        throw new HttpError(400, 'Invalid key!')
    await updatePassword(user, password);
    await flow.finish(key);
    ctx.status = 204;
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
