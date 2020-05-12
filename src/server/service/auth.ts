import {createUser, getUser, getUserWithAllFields} from './user';
import {validateObject} from '../middlewares/validators';
import {User} from '../model/user';
import {compare, hash} from 'bcryptjs'
import {sign as signToken, verify} from 'jsonwebtoken';
import {pick} from 'lodash';
import {HttpError} from '../middlewares/error-middleware';
import {randomBytes} from 'crypto';

export type Register = {
    email: string,
    displayName: string,
    password: string,
}

export async function hashPassword(password: string) {
    return hash(password, 10);
}

export async function register(body: Register) {
    const {password, ...data} = validateObject(body, ['email', 'password', 'displayName'])
    const hashed = await hashPassword(password);
    const user = await createUser({...data, password: hashed});
    return {
        user,
        ...createTokens(user),
    };
}

export type Login = {
    email: string,
    password: string,
}

export async function login(body: Login) {
    const {email, password} = validateObject(body, ['email', 'password'])
    let user = await User.findOne({where: {email}, select: User.selectAll});
    if (!user)
        throw new HttpError(400, 'Incorrect credentials!');
    const valid = await compare(password, user.password);
    if (!valid)
        throw new HttpError(400, 'Incorrect credentials!');
    user.invalidate = false;
    await user.save();
    user = await getUser(user.id);
    return {
        user,
        ...createTokens(user),
    };
}

export async function forceLogout({id}: User): Promise<void> {
    const user = await getUserWithAllFields(id, undefined);
    user.invalidate = true;
    await user.save();
}

export async function refresh(body: any) {
    const {refreshToken} = validateObject(body, ['refreshToken']);
    let token: any;
    try {
        token = verify(refreshToken, process.env.JWT_KEY as string);
    } catch (e) {
        throw new HttpError(400, 'Invalid refresh token!');
    }
    let user = await User.findOne({where: {id: token?.user?.id}, select: User.selectAll})
    if (!user)
        throw new HttpError(400, 'Invalid user in refresh token!');
    if (user.invalidate)
        throw new HttpError(400, 'Your access was invalidated, log in again!');
    user = await getUser(user.id);
    return {
        user,
        ...createTokens(user),
    };
}

function createTokens(user: User) {
    return {
        accessToken: sign(user, 15 * 60),
        refreshToken: sign(user, 7 * 24 * 60 * 60),
    };
}

export function sign(user: User, expiresIn: number) {
    return signToken(
        {
            user: pick(user, ['id', 'displayName']),
        },
        process.env.JWT_KEY as string,
        {
            expiresIn,
        },
    );
}

export function flowWithEmail(key: 'confirmEmail' | 'changeEmail' | 'resetPassword') {
    function generateKey() {
        return randomBytes(16).toString('hex');
    }

    async function start(user: User): Promise<User> {
        user = await getUserWithAllFields(user.id);
        user[key] = generateKey();
        return user.save();
    }

    async function getUser(value: string): Promise<User | undefined> {
        return User.findOne({where: {[key]: value}, select: User.selectAll});
    }

    async function verify(value: string): Promise<boolean> {
        const user = await getUser(value);
        return !!user;
    }

    async function finish(value: string): Promise<void> {
        const user = await getUser(value);
        if (!user)
            throw new Error('You forgot to verify key in email flow!')
        user[key] = null;
        await user.save();
    }

    return {start, verify, finish, getUser};
}
