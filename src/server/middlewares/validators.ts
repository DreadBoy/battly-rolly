import {ParameterizedContext} from 'koa';
import {HttpError} from './error-middleware';
import {pick, isNil} from 'lodash';

export function validateParam(ctx: ParameterizedContext, param: string) {
    if (!ctx.params[param])
        throw new HttpError(400, `Missing required parameter <${param}>!`);
    return ctx.params[param];
}

export function validateBody(ctx: ParameterizedContext, required: string[], optional: string[] = []): any {
    const body = ctx.request.body;
    if (!body)
        throw new HttpError(400, 'Missing request body!');
    return validateObject(body, required, optional);
}

export function validateObject(obj: any, required: string[], optional: string[] = []): any {
    const missing = required.filter(key => isNil(obj[key]));
    if (missing.length > 0)
        throw new HttpError(400, `Missing required keys ${missing.map(k => `<${k}>`).join(', ')} in request body!`);
    return pick(obj, [...required, ...optional]);
}
