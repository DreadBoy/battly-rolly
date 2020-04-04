import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {validateBody, validateParam} from '../middlewares/validators';
import {getLogsInEncounter, startLog, updateLog} from '../service/log';

const router = new Router<AuthenticatedUser>();

router.get('/encounter/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getLogsInEncounter(id);
});

router.post('/encounter/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, ['source', 'target', 'type'], ['attack', 'stat', 'DC']);
    ctx.body = await startLog(id, ctx.state.user, body);
});

router.put('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await updateLog(id, ctx.state.user, ctx.request.body);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
