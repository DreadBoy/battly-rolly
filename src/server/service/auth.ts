import {createUser} from './user';
import {validateObject} from '../middlewares/validators';
import {User} from '../model/user';
import {sign} from '../middlewares/authenticate';

export type Register = {
    email: string,
    displayName: string,
    password: string,
}

export async function register(body: Register) {
    body = validateObject(body, ['email', 'password', 'displayName'])
    const user = await createUser(body);
    return {
        user,
        token: sign(user),
    };
}

export type Login = {
    email: string,
    password: string,
}

export async function login(body: Login): Promise<void> {
    const {password, ...body2} = validateObject(body, ['email', 'password'])

}

export async function logout(user: User): Promise<void> {
}

