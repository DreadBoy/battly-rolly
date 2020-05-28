import {createConnection, getConnection, getRepository} from 'typeorm';
import {User} from '../model/user';
import {Campaign} from '../model/campaign';
import {Encounter} from '../model/encounter';
import {Feature} from '../model/feature';
import {Log} from '../model/log';
import {Monster} from '../model/monster';
import {Action} from '../model/action';
import {campaigns, users, encounters, monsters, features} from './test-data';

export async function beforeEach() {
    const conn = await createConnection({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Campaign, Encounter, Feature, Log, Monster, Action],
        synchronize: true,
        logging: false,
    });
    await conn.runMigrations();
}

export async function afterEach() {
    let conn = getConnection();
    await conn.close();
}

export async function seedUsers() {
    await getRepository(User).save(users)
}

export async function seedCampaigns() {
    await getRepository(Campaign).save(campaigns)
}

export async function seedEncounters() {
    await getRepository(Encounter).save(encounters)
}

export async function seedFeatures() {
    await getRepository(Feature).save(features)
}

export async function seedMonsters() {
    await getRepository(Monster).save(monsters)
}
