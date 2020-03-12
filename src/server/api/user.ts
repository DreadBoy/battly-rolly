import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {User} from '../model';
import {HttpError} from '../middlewares/error-middleware';
import {getUser} from '../service/user';

const router = new Router<AuthenticatedUser>();

router.post('/', async ctx => {
    const user = await new User();
    await user.save();
    ctx.body = user;
});
router.get('/:id', authenticate, async ctx => {
    if (!ctx.params.id)
        throw new HttpError(400, 'Missing required parameter <id>');
    ctx.body = await getUser(ctx.params.id);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
