import * as Koa from 'koa';

export const errorMiddleware: Koa.Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        if (error instanceof HttpError || error.name === 'HttpError') {
            console.error(error);
            ctx.status = error.status;
            ctx.body = {
                message: error.message,
            };
            return;
        }
        if (error.name === 'UnauthorizedError') {
            ctx.status = error.statusCode;
            ctx.body = {
                message: error.message,
            };
            return;
        }
        console.error(error);
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
