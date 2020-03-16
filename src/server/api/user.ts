import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {createUser, getUser} from '../service/user';
import {validateParam} from '../middlewares/validate-param';

const router = new Router<AuthenticatedUser>();

router.post('/', async ctx => {
    ctx.body = await createUser();
});

router.get('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getUser(id);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};