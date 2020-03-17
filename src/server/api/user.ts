import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {createUser, getUser, updateUser} from '../service/user';
import {validateParam} from '../middlewares/validate-param';
import {pick} from 'lodash';

const router = new Router<AuthenticatedUser>();

router.post('/', async ctx => {
    ctx.body = await createUser();
});

router.get('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getUser(id);
});

router.put('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await updateUser(id, pick(ctx.request.body, 'name'));
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
