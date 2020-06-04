import * as Koa from 'koa';
import {logger} from '../logger';

export const errorMiddleware: Koa.Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        if (error instanceof HttpError || error.name === 'HttpError') {
            logger.error(error);
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
        logger.error(error);
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
