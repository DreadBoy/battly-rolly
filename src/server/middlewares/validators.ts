import {ParameterizedContext} from 'koa';
import {HttpError} from './error-middleware';
import {pick} from 'lodash';

export const validateParam = (ctx: ParameterizedContext, param: string) => {
    if (!ctx.params[param])
        throw new HttpError(400, `Missing required parameter <${param}>!`);
    return ctx.params[param];
};

export const validateBody = (ctx: ParameterizedContext, required: string[], optional: string[] = []): any => {
    const body = ctx.request.body;
    if (!body)
        throw new HttpError(400, 'Missing request body!');
    const missing = required.filter(key => typeof ctx.request.body[key] === 'undefined');
    if (missing.length > 0)
        throw new HttpError(400, `Missing required keys ${missing.map(k => `<${k}>`).join(', ')} in request body!`);
    return pick(ctx.request.body, [...required, ...optional]);
};
