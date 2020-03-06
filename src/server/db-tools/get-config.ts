import {ConnectionOptions} from 'typeorm/connection/ConnectionOptions';

export function getConfig(DATABASE_URL?: string): ConnectionOptions {
    if (!DATABASE_URL)
        throw new Error('Missing connection string');
    const regexp = /^(.*?):\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*?)$/;
    const match = (DATABASE_URL).match(regexp);
    if (!match)
        throw new Error('Didn\'t match');

    return {
        type: match[1] as any,
        host: match[4],
        port: parseInt(match[5]),
        username: match[2],
        password: match[3],
        database: match[6],
        logging: ['error', 'warn'],
        extra: {
            ssl: true,
        },
    }
}
