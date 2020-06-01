import {createConnection, getConnection} from 'typeorm';
import {User} from '../model/user';
import {Campaign} from '../model/campaign';
import {Encounter} from '../model/encounter';
import {Feature} from '../model/feature';
import {Log} from '../model/log';
import {Monster} from '../model/monster';
import {Action} from '../model/action';
import {Seed1590653101958} from './seed-mifration';

export async function beforeEach() {
    const conn = await createConnection({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Campaign, Encounter, Feature, Log, Monster, Action],
        migrations: [Seed1590653101958],
        synchronize: true,
        logging: false,
    });
    await conn.runMigrations();
}

export async function afterEach() {
    let conn = getConnection();
    return conn.close();
}
