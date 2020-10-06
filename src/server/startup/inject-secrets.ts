import {SecretManagerServiceClient} from '@google-cloud/secret-manager';
import {logger} from '../logger';
import {blue} from 'chalk';

export async function injectSecrets() {
    logger.info(blue('Injecting secrets into process.env'));
    const client = new SecretManagerServiceClient();
    const keys = ['BASE_URL', 'DATABASE_URL', 'JWT_KEY', 'SENDGRID_API_KEY']

    const values = await Promise.all(keys.map(async key => {
        const [accessResponse] = await client.accessSecretVersion({
            name: `projects/942805254397/secrets/${key}/versions/latest`,
        });
        return accessResponse?.payload?.data?.toString();
    }));
    keys.forEach((key, index) =>
        process.env[key] = process.env[key] || values[index]);
}
