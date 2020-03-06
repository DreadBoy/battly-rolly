import {existsSync, readdirSync, unlinkSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {getConfig} from './get-config';
import {dieWith} from './die-with';

let DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    const nodemonConfig = require('../../nodemon');
    if (!nodemonConfig)
        dieWith('Missing DATABASE_URL and nodemon.json');
    DATABASE_URL = nodemonConfig.env.DATABASE_URL;
}
let ormconfig = getConfig(DATABASE_URL);
ormconfig = {
    ...ormconfig,
    entities: ['build/model/*.js'],
    migrations: ['build/migrations/*.js'],
    cli: {
        migrationsDir: 'build/migrations',
        entitiesDir: 'build/model',
    },
};

console.log('Creating ormconfig.json');
writeFileSync('ormconfig.json', JSON.stringify(ormconfig, null, 2));

const migrationsDir = 'build/migrations';

if (!existsSync(migrationsDir)) {
    console.log(`Dir '${migrationsDir}' doesn't exist, skipping migrations!`);
} else {
    const migrations = readdirSync(migrationsDir).filter(name => name.endsWith('js'));

    console.log(`Applying migrations ${migrations.join(', ')}`);
    execSync('typeorm migration:run', {stdio: 'inherit'});
}

console.log('Removing ormconfig.json');
unlinkSync('ormconfig.json');
