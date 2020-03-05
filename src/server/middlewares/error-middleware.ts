import * as Koa from 'koa';

export const errorMiddleware: Koa.Middleware = async (ctx, next) => {
    try {
        await next();
    }
    catch (error) {
        console.error(error);
        if(error instanceof HttpError) {
            ctx.status = error.status;
            ctx.body = error.body;
            return;
        }
        ctx.status = 500;
        ctx.body = {
            message: 'Internal server error'
        };
    }
};

export class HttpError extends Error {
    constructor(public status: number, public body: {[key: string]: any}, message?: string) {
        super(message);
    }
}
