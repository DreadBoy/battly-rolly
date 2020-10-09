import Koa from 'koa';
import KoaStatic from 'koa-static-server';
import {join} from 'path';

export function app() {
    const app = new Koa();
    app.use(KoaStatic({
        rootDir: join(process.cwd(), 'build'),
        notFoundFile: 'index.html',
        maxage: 1000 * 60 * 60 * 1,
    }));
    return app;
}
