import 'reflect-metadata';
import {Connection, createConnection} from 'typeorm';
import * as Koa from 'koa';
import {Entity, Encounter} from '../model';

let connection: Connection;

async function connect() {
    const regexp = /^(.*?):\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*?)$/;
    if (!process.env.DATABASE_URL)
        throw new Error('Invalid or missing DATABASE_URL env variable');
    const match = (process.env.DATABASE_URL as string).match(regexp);
    if (!match)
        throw new Error('Didn\'t match');
    connection = await createConnection({
        type: match[1] as any,
        host: match[4],
        port: parseInt(match[5]),
        username: match[2],
        password: match[3],
        database: match[6],
        entities: [Encounter, Entity],
        migrations: [],
        logging: ['error', 'warn'],
        extra: {
            ssl: true,
        },
    });
    return connection;
}


export const ensureDatabase: Koa.Middleware = async (ctx, next) => {
    if(!connection)
        await connect();
    return next();
};
