import {createUser, getUser} from './user';
import {validateObject} from '../middlewares/validators';
import {User} from '../model/user';
import {compare, hash} from 'bcryptjs'
import {sign as signToken, verify} from 'jsonwebtoken';
import {pick} from 'lodash';
import {HttpError} from '../middlewares/error-middleware';

export type Register = {
    email: string,
    displayName: string,
    password: string,
}

export async function register(body: Register) {
    const {password, ...data} = validateObject(body, ['email', 'password', 'displayName'])
    const hashed = await hash(password, 10);
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
    let user = await User.findOne({where: {email}});
    if (!user)
        throw new HttpError(400, 'Incorrect credentials!');
    const valid = await compare(password, user.password);
    if (!valid)
        throw new HttpError(400, 'Incorrect credentials!');
    user.invalidate = false;
    user = await user.save();
    return {
        user,
        ...createTokens(user),
    };
}

export async function forceLogout({id}: User): Promise<void> {
    const user = await getUser(id);
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
    const user = await User.findOne({where: {id: token?.user?.id}})
    if (!user)
        throw new HttpError(400, 'Invalid user in refresh token!');
    if (user.invalidate)
        throw new HttpError(400, 'Your access was invalidated, log in again!');
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
