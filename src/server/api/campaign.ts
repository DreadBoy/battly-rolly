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
} from '../service/campaign';
import {validateParam} from '../middlewares/validate-param';
import {createEncounter, getActiveEncounter, getEncounters} from '../service/encounter';
import {pick} from 'lodash';

const router = new Router<AuthenticatedUser>();

router.post('/', authenticate, async ctx => {
    ctx.body = await createCampaign(ctx.state.user, pick(ctx.request.body, 'name'));
});

router.get('/', authenticate, async ctx => {
    ctx.body = await getCampaignsForUser(ctx.state.user);
});

router.get('/:id', authenticate, async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getCampaign(id);
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
    await removeUserFromCampaign(id, ctx.state.user);
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
