import {Middleware} from 'koa';
import {User} from '../model';

export type AuthenticatedUser = {
    user: User;
}

export const authenticate: Middleware<AuthenticatedUser> = async (ctx, next) => {
    let user: User | undefined = undefined;
    if (ctx.get('Authorization')) {
        user = await User.findOne(ctx.get('Authorization'));
    }
    if (!user) {
        user = new User();
        await user.save();
    }
    ctx.state.user = user;
    return next();
};
