import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {validateBody, validateParam} from '../middlewares/validators';
import {getFeature, updateFeature, updateFeatures} from '../service/feature';

const router = new Router<AuthenticatedUser>();

router.get('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getFeature(id);
});

router.put('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, [], ['AC', 'HP']);
    ctx.body = await updateFeature(id, body);
});

router.put('/', authenticate, async ctx => {
    ctx.body = await updateFeatures(ctx.request.body);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
