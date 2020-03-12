import * as Koa from 'koa';

export const errorMiddleware: Koa.Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.error(error);
        if (error instanceof HttpError || error.name === 'HttpError') {
            ctx.status = error.status;
            ctx.body = {
                message: error.message,
            };
            return;
        }
        ctx.status = 500;
        ctx.body = {
            message: 'Internal server error',
        };
    }
};

export class HttpError extends Error {
    constructor(public status: number, message?: string) {
        super(message);
        this.name = 'HttpError';
        Error.captureStackTrace(this, HttpError)
    }
}
