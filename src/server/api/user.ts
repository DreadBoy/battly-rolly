import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {createUser, getUser, updateUser} from '../service/user';
import {validateBody, validateParam} from '../middlewares/validators';

const router = new Router<AuthenticatedUser>();

router.post('/', async ctx => {
    ctx.body = await createUser(validateBody(ctx, 'name'));
});

router.get('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getUser(id);
});

router.put('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, 'name');
    ctx.body = await updateUser(id, body);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
