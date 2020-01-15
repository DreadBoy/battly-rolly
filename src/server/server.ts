import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/probe', ctx => ctx.response.status = 200);

app
    .use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await next();
    })
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);
