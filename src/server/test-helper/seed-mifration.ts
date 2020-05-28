import {getRepository, MigrationInterface, QueryRunner} from 'typeorm';
import {User} from '../model/user';

export function getGm() {
    return users[0] as User;
}

export function getWizard() {
    return users[1] as User;
}

export function testCampaign() {
    return {
        name: 'Test campaign',
    };
}

const users = [{
    id: '56253fc4-252d-4f4c-9207-032171d62d8c',
    email: 'gm@example.com',
    displayName: 'Test',
    password: 'test',
} as User, {
    id: 'd8e95e8f-ff24-4d5c-95cc-e8ae54246f36',
    email: 'wizard@example.com',
    displayName: 'Wizard',
    password: 'wizard',
} as User];

export class Seed1590653101958 implements MigrationInterface {
    public async up(_: QueryRunner): Promise<any> {
        await getRepository(User).save(users)
    }

    public async down(_: QueryRunner): Promise<any> {
        // do nothing
    }
}
