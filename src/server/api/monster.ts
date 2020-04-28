import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {validateParam, validateQuery} from '../middlewares/validators';
import {
    createMonster,
    deleteMonster, getAvailableMonsters,
    getMonster,
    searchAllMonsters,
    searchAvailableMonsters, subscribe, unsubscribe,
    updateMonster,
} from '../service/monster';

const router = new Router<AuthenticatedUser>();

router.get('/search', authenticate, async ctx => {
    const search = validateQuery(ctx, 'search');
    ctx.body = await searchAvailableMonsters(search, ctx.state.user);
});
router.get('/searchAll', authenticate, async ctx => {
    const search = validateQuery(ctx, 'search');
    ctx.body = await searchAllMonsters(search);
});

router.get('/', authenticate, async ctx => {
    ctx.body = await getAvailableMonsters(ctx.state.user);
});

router.get('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getMonster(id);
});

router.post('/', authenticate, async ctx => {
    ctx.body = await createMonster(ctx.state.user, ctx.request.body);
});

router.put('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await updateMonster(id, ctx.state.user, ctx.request.body);
});

router.delete('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await deleteMonster(id, ctx.state.user);
});

router.post('/:id/sub', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await subscribe(id, ctx.state.user);
});

router.delete('/:id/sub', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await unsubscribe(id, ctx.state.user);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
