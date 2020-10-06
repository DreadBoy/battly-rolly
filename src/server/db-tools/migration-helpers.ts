import {injectSecrets} from '../startup/inject-secrets';
import {getConfig} from './get-config';
import { promises as fs } from 'fs';

export async function injectNodemonEnv() {
    const nodemonConfig = require('../../nodemon');
    if (!nodemonConfig)
        throw new Error('Missing nodemon.json');
    for (const key in nodemonConfig.env) {
        process.env[key] = nodemonConfig.env[key];
    }
    await injectSecrets();
}

export async function createOrmConfig(values: any) {
    const ormConfig = {
        ...getConfig(process.env.DATABASE_URL),
        ...values,
    };

    console.log('Creating ormconfig.json');
    await fs.writeFile('ormconfig.json', JSON.stringify(ormConfig, null, 2));
    return ormConfig;
}

export async function deleteOrmConfig() {
    console.log('Removing ormconfig.json');
    await fs.unlink('ormconfig.json');
}
