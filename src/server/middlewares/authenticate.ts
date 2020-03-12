import {Middleware} from 'koa';
import {User} from '../model';
import {HttpError} from './error-middleware';

export type AuthenticatedUser = {
    user: User;
}

export const authenticate: Middleware<AuthenticatedUser> = async (ctx, next) => {
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
