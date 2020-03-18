import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser'
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {validateBody, validateParam} from '../middlewares/validators';
import {createLog, deleteEncounter, getEncounter, setActiveEncounter} from '../service/encounter';

const router = new Router<AuthenticatedUser>();

router.get(`/:id`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getEncounter(id);
});
router.delete(`/:id`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    await deleteEncounter(id, ctx.state.user);
    ctx.status = 204;
});

router.post(`/:id/active`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    await setActiveEncounter(id, ctx.state.user);
    ctx.status = 204;
});

router.put(`/:id`, bodyParser(), authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, 'source', 'target');
    await createLog(id, ctx.state.user, body);
    ctx.status = 204;
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
