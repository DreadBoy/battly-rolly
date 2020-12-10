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
import {logger} from '../logger';
import {blue} from 'chalk';

export async function connectDatabase() {
    if (!process.env.DATABASE_URL)
        throw new Error('Invalid or missing DATABASE_URL env variable');
    logger.info(blue('Connecting to database'));
    try {
        const connection = getConnection();
        if (connection)
            return connection;
    } catch (e) {
        if (!(e instanceof ConnectionNotFoundError))
            throw e;
    }
    let config = getConfig(process.env.DATABASE_URL);
    config = {
        ...config,
        entities: [User, Campaign, Encounter, Feature, Log, Monster, Action],
        migrations: [],
    };
    return createConnection(config);
}
