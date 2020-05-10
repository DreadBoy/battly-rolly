import {User} from '../model/user';
import {HttpError} from '../middlewares/error-middleware';
import {assign} from 'lodash';
import {validateObject} from '../middlewares/validators';

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

export const getUsers = async (ids: string[], relations: string[] = []): Promise<User[]> => {
    return User.findByIds(ids, {relations});
};

export const updateUser = async (id: string, body: Partial<User>): Promise<User> => {
    body = validateObject(body, ['displayName']);
    const user = await getUser(id);
    assign(user, body);
    await user.save();
    return user;
};
