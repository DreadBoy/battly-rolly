import 'reflect-metadata';
import {Connection, createConnection} from 'typeorm';
import * as Koa from 'koa';
import {getConfig} from '../db-tools/get-config';
import {User} from '../model/user';
import {Campaign} from '../model/campaign';
import {Encounter} from '../model/encounter';
import {Feature} from '../model/feature';
import {Log} from '../model/log';
import {Monster} from '../model/monster';
import {Action} from '../model/action';

let connection: Connection;


async function connect() {
    if (!process.env.DATABASE_URL)
        throw new Error('Invalid or missing DATABASE_URL env variable');
    let config = getConfig(process.env.DATABASE_URL);
    config = {
      ...config,
        entities: [User, Campaign, Encounter, Feature, Log, Monster, Action],
        migrations: [],
        synchronize: true,
    };
    connection = await createConnection(config);
    return connection;
}


export const ensureDatabase: Koa.Middleware = async (ctx, next) => {
    if(!connection)
        await connect();
    return next();
};
