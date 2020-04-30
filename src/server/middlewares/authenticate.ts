import {User} from '../model/user';
import jwt from 'koa-jwt';
import {sign as signToken} from 'jsonwebtoken';

export type AuthenticatedUser = {
    user: User;
}

if (!process.env.JWT_KEY)
    throw new Error('Missing process.env.JWT_KEY!');
export const authenticate = jwt({secret: process.env.JWT_KEY});

export function sign(user: User) {
    if (!process.env.JWT_KEY)
        throw new Error('Missing process.env.JWT_KEY!');
    return signToken(JSON.stringify(user), process.env.JWT_KEY);
}
