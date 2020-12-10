import {existsSync, readdirSync} from 'fs';
import {execSync} from 'child_process';
import {createOrmConfig, deleteOrmConfig, injectNodemonEnv} from './migration-helpers';

async function applyMigrations() {
    await injectNodemonEnv();
    const ormConfig = await createOrmConfig({
        entities: ['build-server/model/*.js'],
        migrations: ['build-server/migrations/*.js'],
        cli: {
            migrationsDir: 'build-server/migrations',
            entitiesDir: 'build-server/model',
        },
    });

    if (!existsSync(ormConfig.cli.migrationsDir)) {
        console.log(`Dir '${ormConfig.cli.migrationsDir}' doesn't exist, skipping migrations!`);
    } else {
        const migrations = readdirSync(ormConfig.cli.migrationsDir).filter(name => name.endsWith('js'));

        console.log(`Applying migrations ${migrations.join(', ')}`);
        execSync('typeorm migration:run', {stdio: 'inherit'});
    }

    await deleteOrmConfig();

}

applyMigrations()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
