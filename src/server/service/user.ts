import {User} from '../model/user';
import {HttpError} from '../middlewares/error-middleware';
import {assign} from 'lodash';
import {validateObject} from '../middlewares/validators';

export const createUser = async (body: Partial<User>): Promise<User> => {
    const {password, ...body2} = validateObject(body, ['email', 'displayName', 'password'])
    const user = new User();
    assign(user, body2);
    // await user.save();
    return user;
};

export const getUser = async (id: string, relations: string[] = []): Promise<User> => {
    const user = await User.findOne(id, {relations});
    if (!user)
        throw new HttpError(404, `User with id ${id} not found`);
    return user;
};

export const getUsers = async (ids: string[], relations: string[] = []): Promise<User[]> => {
    return User.findByIds(ids, {relations});
};

export const updateUser = async (id: string, body: Partial<User>): Promise<User> => {
    const user = await getUser(id);
    assign(user, body);
    await user.save();
    return user;
};
