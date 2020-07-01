import 'reflect-metadata';
import {createConnection, getConnection} from 'typeorm';
import {getConfig} from '../db-tools/get-config';
import {User} from '../model/user';
import {Campaign} from '../model/campaign';
import {Encounter} from '../model/encounter';
import {Feature} from '../model/feature';
import {Log} from '../model/log';
import {Monster} from '../model/monster';
import {Action} from '../model/action';
import {ConnectionNotFoundError} from 'typeorm/error/ConnectionNotFoundError';

export async function connectDB() {
    try {
        const connection = getConnection();
        if (connection)
            return connection;
    } catch (e) {
        if (!(e instanceof ConnectionNotFoundError))
            throw e;
    }
    if (!process.env.DATABASE_URL)
        throw new Error('Invalid or missing DATABASE_URL env variable');
    let config = getConfig(process.env.DATABASE_URL);
    config = {
        ...config,
        entities: [User, Campaign, Encounter, Feature, Log, Monster, Action],
        migrations: [],
        synchronize: true,
    };
    return createConnection(config);
}
