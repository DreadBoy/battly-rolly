import {ConnectionOptions} from 'typeorm/connection/ConnectionOptions';

export function getConfig(DATABASE_URL?: string): ConnectionOptions {
    if (!DATABASE_URL)
        throw new Error('Missing connection string');
    const regexp = /^(.*?):\/\/(.*?):(.*?)@(.+)(:(.*?))?\/(.*?)$/;
    const match = (DATABASE_URL).match(regexp);
    if (!match)
        throw new Error('Didn\'t match');

    return {
        type: match[1] as any,
        host: match[4],
        username: match[2],
        password: match[3],
        database: match[7],
        logging: ['error', 'warn'],
        extra: {
            ssl: false,
        },
        synchronize: false,
    }
}
