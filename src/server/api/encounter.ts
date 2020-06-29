import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {validateBody, validateParam} from '../middlewares/validators';
import {deleteEncounter, getEncounter, toggleActiveEncounter, updateEncounter} from '../service/encounter';
import {addFeatures} from '../service/feature';

const router = new Router<AuthenticatedUser>();

router.get(`/:id`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getEncounter(id);
});

router.put(`/:id`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, ['name']);
    ctx.body = await updateEncounter(id, body);
});

router.delete(`/:id`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    await deleteEncounter(id, ctx.state.user);
    ctx.status = 204;
});

router.post(`/:id/active`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    await toggleActiveEncounter(id, ctx.state.user);
    ctx.status = 204;
});

router.post(`/:id/feature`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, ['features']);
    await addFeatures(id, body);
    ctx.status = 204;
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
