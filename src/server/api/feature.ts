import Koa from 'koa';
import Router from '@koa/router';
import {AuthenticatedUser} from '../middlewares/authenticate';
import {validateBody, validateParam} from '../middlewares/validators';
import { updateFeature } from '../service/feature';

const router = new Router<AuthenticatedUser>();

router.put('/:id', async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, [], ['AC', 'HP']);
    ctx.body = await updateFeature(id, body);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
