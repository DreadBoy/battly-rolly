import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/', ctx => ctx.response.body = {hello: 'hi'});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);
