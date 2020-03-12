import {User} from '../model';
import {HttpError} from '../middlewares/error-middleware';

export const getUser = async (id: string): Promise<User> => {
    let user: User | undefined = undefined;
    try {
        user = await User.findOne(id);
    } catch (e) {
        console.error(e);
        throw new HttpError(404, `User with id ${id} not found`);
    }
    if (!user)
        throw new HttpError(404, `User with id ${id} not found`);
    return user;
};
