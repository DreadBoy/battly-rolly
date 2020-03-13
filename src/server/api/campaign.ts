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

const router = new Router<AuthenticatedUser>();

router.post('/', async ctx => {
    ctx.body = await createCampaign(ctx.state.user);
});

router.get('/', async ctx => {
    ctx.body = await getCampaignsForUser(ctx.state.user);
});

router.get('/:id', async ctx => {
    const id = validateParam(ctx, 'id');
    ctx.body = await getCampaign(id);
});

router.delete('/:id', async ctx => {
    const id = validateParam(ctx, 'id');
    await deleteCampaign(id, ctx.state.user);
    ctx.status = 204;
});

router.post('/:id/user', async ctx => {
    const id = validateParam(ctx, 'id');
    await addUserToCampaign(id, ctx.state.user);
    ctx.status = 204;
});

router.delete('/:id/user', async ctx => {
    const id = validateParam(ctx, 'id');
    await removeUserFromCampaign(id, ctx.state.user);
    ctx.status = 204;
});

const app = new Koa();
app.use(authenticate);
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
