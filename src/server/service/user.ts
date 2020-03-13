import {User} from '../model/user';
import {HttpError} from '../middlewares/error-middleware';

export const createUser = async (): Promise<User> => {
    const user = new User();
    await user.save();
    return user;
};
export const getUser = async (id: string): Promise<User> => {
    const user = await User.findOne(id);
    if (!user)
        throw new HttpError(404, `User with id ${id} not found`);
    return user;
};
