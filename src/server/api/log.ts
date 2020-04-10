import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {validateParam} from '../middlewares/validators';
import {confirmDamage, dealDamage, getLogsInEncounter, resolveResult, startLog} from '../service/log';

const router = new Router<AuthenticatedUser>();

router.get('/encounter/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getLogsInEncounter(id);
});

router.post('/encounter/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await startLog(id, ctx.state.user, ctx.request.body);
});

router.put('/:id/resolve-result', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await resolveResult(id, ctx.state.user, ctx.request.body);
});

router.put('/:id/deal-damage', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await dealDamage(id, ctx.state.user, ctx.request.body);
});

router.put('/:id/confirm-damage', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await confirmDamage(id, ctx.state.user, ctx.request.body);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
