import {injectSecrets} from './startup/inject-secrets';
import {connectDatabase} from './startup/connect-database';

injectSecrets().then(connectDatabase).then(() => {
    const {startServer} = require('./startup/start-server');
    startServer();
}).catch(e => {
    console.error(e);
    process.exit(1);
});
