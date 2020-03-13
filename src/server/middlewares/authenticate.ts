import {Middleware} from 'koa';
import {User} from '../model/user';
import {HttpError} from './error-middleware';

export type AuthenticatedUser = {
    user: User;
}

export const authenticate: Middleware<AuthenticatedUser> = async (ctx, next) => {
    if (ctx.state.user)
        throw new Error('There are 2 \'authenticate\' middlewares in stack, this isn\'t allowed');
    let user: User | undefined = undefined;
    if (ctx.get('Authorization'))
        try {
            user = await User.findOne(ctx.get('Authorization'));
        } catch (e) {
            throw new HttpError(401, 'You are not logged in!');
        }
    if (!user)
        throw new HttpError(401, 'You are not logged in!');
    ctx.state.user = user;
    return next();
};
