import {unlinkSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
// @ts-ignore
import isVarName from 'is-var-name';
import {dieWith} from './die-with';
import {getConfig} from './get-config';

const migrationName = process.argv[2];
if (!migrationName)
    dieWith('Missing migration name. Use \'npm run create-migration -- MigrationName\'');
if (!isVarName(migrationName))
    dieWith(`Migration name '${migrationName} seems like invalid Javascript variable name`);


const nodemonConfig = require('../../nodemon');
if (!nodemonConfig)
    dieWith('Missing nodemon.json');
const DATABASE_URL = nodemonConfig.env.DATABASE_URL;
let ormconfig = getConfig(DATABASE_URL);
ormconfig = {
    ...ormconfig,
    entities: ['build/model/*.js'],
    migrations: ['build/migrations/*.js'],
    cli: {
        migrationsDir: 'src/server/migrations',
    },
};

console.log('Creating ormconfig.json');
writeFileSync('ormconfig.json', JSON.stringify(ormconfig, null, 2));

console.log(`Generating migration ${migrationName}`);
execSync(`typeorm migration:generate -n ${migrationName}`, {stdio: 'inherit'});

console.log('Removing ormconfig.json');
unlinkSync('ormconfig.json');

console.log(`Migration ${migrationName} generated. Don't forget to include it in database config!`);
