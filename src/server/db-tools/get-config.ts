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
        url: DATABASE_URL,
        logging: ['error', 'warn'],
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    }
}
