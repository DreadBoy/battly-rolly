import {getRepository, MigrationInterface, QueryRunner} from 'typeorm';
import {User} from '../model/user';

export async function getGm() {
    const gm = await User.findOne({where: {id: '56253fc4-252d-4f4c-9207-032171d62d8c'}});
    return gm as User;
}

const users = [{
    id: '56253fc4-252d-4f4c-9207-032171d62d8c',
    email: 'gm@example.com',
    displayName: 'Test',
    password: 'test',
}];

export class Seed1590653101958 implements MigrationInterface {
    public async up(_: QueryRunner): Promise<any> {
        await getRepository(User).save(users)
    }

    public async down(_: QueryRunner): Promise<any> {
        // do nothing
    }
}
