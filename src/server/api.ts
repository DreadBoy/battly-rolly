import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import {app as probeApi} from './api/probe';
import {app as authApi} from './api/auth';
import {app as userApi} from './api/user';
import {app as campaignApi} from './api/campaign';
import {app as encounterApi} from './api/encounter';
import {app as featureApi} from './api/feature';
import {app as logApi} from './api/log';
import {app as monsterApi} from './api/monster';
import {app as emailApi} from './api/email';
import {errorMiddleware} from './middlewares/error-middleware';

export function api() {
    const app = new Koa();
    app.use(errorMiddleware);
    app.use(bodyParser());
    app.use(mount('/auth', authApi));
    app.use(mount('/user', userApi));
    app.use(mount('/campaign', campaignApi));
    app.use(mount('/encounter', encounterApi));
    app.use(mount('/feature', featureApi));
    app.use(mount('/log', logApi));
    app.use(mount('/monster', monsterApi));
    app.use(mount('/email', emailApi));
    app.use(mount('/probe', probeApi));
    return app;
}
