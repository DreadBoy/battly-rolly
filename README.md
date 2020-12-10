## Local setup
Your local setup will be connecting to DEV database and DEV secrets. Download and install GCloud SDK. Log in with Google account that is tied to Crit Hit project. To access DEV database you need to run [Cloud SQL proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy) (run `service-accounts/cloud_sql_proxy.sh` on Windows). It will work as long as you are logged into GCloud SDK and correct credentials are provided in nodemon.json. Secrets are accessed via service account that is authenticated with JSON key `crit-hit-dev.json`. GCloud doesn't support ENV management from GCloud console, so we read secrets and inject them into ENV before starting server.

Once set up, you start local server by running `service-accounts/cloud_sql_proxy.sh`, `server:watch`, `server:start` and `client:start` in that order.

##GCloud setup

1. Create new app
2. Enable Secret Manager and add all secrets (refer to `inject-secrets.ts`)
3. Create service account and download its private key
4. Under IAM, assign "Secret Manager Secret Accessor" and "Secret Manager Viewer" roles to newly created service account

## Deployment
Run`yarn run deploy` and `yarn run server:start` right after serve is built. I know, deployment process is manual...


## Potential names
* Critical Hit / CritHit
* Dice Squire
* Nat20 (also YT channel 😩)
* Roll squire
* Critical Roll / CritRoll
* Never Roll
* Hit Tracker
* Battle Tracker
* Battlers Gate
