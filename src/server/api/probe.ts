import Koa from 'koa';
import Router from '@koa/router';

const router = new Router();

router.get('/probe', async ctx => {
    ctx.response.status = 204;
});

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
export {app};
