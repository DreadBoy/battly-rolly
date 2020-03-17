import Koa from 'koa';
import Router from '@koa/router';
import {authenticate, AuthenticatedUser} from '../middlewares/authenticate';
import {
    addUserToCampaign,
    createCampaign,
    deleteCampaign,
    getCampaign,
    getCampaignsForUser,
    removeUserFromCampaign,
    updateCampaign,
} from '../service/campaign';
import {validateBody, validateParam} from '../middlewares/validators';
import {createEncounter, getActiveEncounter, getEncounters} from '../service/encounter';

const router = new Router<AuthenticatedUser>();

router.post('/', authenticate, async ctx => {
    const body = validateBody(ctx, 'name');
    ctx.body = await createCampaign(ctx.state.user, body);
});

router.get('/', authenticate, async ctx => {
    ctx.body = await getCampaignsForUser(ctx.state.user);
});

router.get('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getCampaign(id);
});

router.put('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, 'name');
    ctx.body = await updateCampaign(id, body);
});

router.delete('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    await deleteCampaign(id, ctx.state.user);
    ctx.status = 204;
});

router.post('/:id/user', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    await addUserToCampaign(id, ctx.state.user);
    ctx.status = 204;
});

router.delete('/:id/user', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    const body = validateBody(ctx, 'id');
    await removeUserFromCampaign(id, ctx.state.user, body);
    ctx.status = 204;
});

router.post(`/:id/encounter`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await createEncounter(id, ctx.state.user);
});

router.get(`/:id/encounter`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getEncounters(id);
});

// Users will use this to get encounter they should be fighting
router.get(`/:id/encounter/active`, authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getActiveEncounter(id);
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
