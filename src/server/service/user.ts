import {User} from '../model/user';
import {HttpError} from '../middlewares/error-middleware';
import {assign} from 'lodash';
import {validateObject} from '../middlewares/validators';
import {hashPassword} from './auth';

export type CreateUser = {
    email: string,
    displayName: string,
    password: string;
}

export const createUser = async (body: CreateUser): Promise<User> => {
    body = validateObject(body, ['email', 'displayName', 'password'])
    const existing = await User.findOne({where: {email: body.email}});
    if (existing)
        throw new HttpError(400, `User with this email already exists!`);
    const user = new User();
    assign(user, body);
    return user.save();
};

export const findUserByEmail = async (email: string): Promise<User> => {
    const user = await User.findOne({where: {email}});
    if (!user)
        throw new HttpError(404, `User with email ${email} not found`);
    return user;
};

export const getUser = async (id: string, relations: string[] = []): Promise<User> => {
    const user = await User.findOne(id, {relations});
    if (!user)
        throw new HttpError(404, `User with id ${id} not found`);
    return user;
};

export const getUserWithAllFields = async (id: string, relations: string[] = []): Promise<User> => {
    const user = await User.findOne(id, {relations, select: User.selectAll});
    if (!user)
        throw new HttpError(404, `User with id ${id} not found`);
    return user;
};

export const updateUser = async (id: string, body: Partial<User>): Promise<User> => {
    body = validateObject(body, ['email', 'displayName']);
    const user = await getUser(id);
    assign(user, body);
    await user.save();
    return user;
};

export const updatePassword = async (user: User, password: string): Promise<User> => {
    password = await hashPassword(password);
    assign(user, {password});
    await user.save();
    return user;
};
