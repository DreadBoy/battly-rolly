import {execSync} from 'child_process';
// @ts-ignore
import isVarName from 'is-var-name';
import {injectNodemonEnv} from './migration-helpers';
import {createOrmConfig, deleteOrmConfig} from './migration-helpers';

async function createMigration() {
    const migrationName = process.argv[2];
    if (!migrationName)
        throw new Error('Missing migration name. Use \'yarn run create-migration -- MigrationName\'');
    if (!isVarName(migrationName))
        throw new Error(`Migration name '${migrationName} seems like invalid Javascript variable name`);


    await injectNodemonEnv();
    await createOrmConfig({
        entities: ['build-server/model/*.js'],
        migrations: ['build-server/migrations/*.js'],
        cli: {
            migrationsDir: 'src/server/migrations',
        },
    });

    console.log(`Generating migration ${migrationName}`);
    execSync(`typeorm migration:generate -n ${migrationName}`, {stdio: 'inherit'});

    await deleteOrmConfig();

    console.log(`Migration ${migrationName} generated. Don't forget to include it in database config!`);
}

createMigration()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e.message);
        process.exit(1);
    });
