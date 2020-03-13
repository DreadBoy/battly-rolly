import {ParameterizedContext} from 'koa';
import {HttpError} from './error-middleware';

export const validateParam = (ctx: ParameterizedContext, param: string) => {
    if (!ctx.params[param])
        throw new HttpError(400, `Missing required parameter <${param}>`);
    return ctx.params[param];
};
