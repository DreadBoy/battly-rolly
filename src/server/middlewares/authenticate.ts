import {User} from '../model/user';
import jwt from 'koa-jwt';
import {Middleware} from 'koa';
import compose from 'koa-compose';

export type AuthenticatedUser = {
    user: User;
}

if (!process.env.JWT_KEY)
    throw new Error('Missing process.env.JWT_KEY!');
export const validateToken = jwt({secret: process.env.JWT_KEY});

export const pullUser: Middleware = async (ctx, next) => {
    if (!ctx.state.user)
        throw new Error('You forgot to include validateToken middleware');
    ctx.state.user = ctx.state.user.user;
    return next();
};

export const authenticate = compose([validateToken, pullUser]);
