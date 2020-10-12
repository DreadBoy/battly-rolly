## Local setup
Your local setup will be connecting to DEV database and DEV secrets. Download and install GCloud SDK. Log in with Google account that is tied to Crit Hit project. To access DEV database you need to run [Cloud SQL proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy) (run `service-accounts/cloud_sql_proxy.sh` on Windows). It will work as long as you are logged into GCloud SDK and correct password is provided in nodemon.json. Secrets are accessed via service account that is authenticated with JSON key `crit-hit-dev.json`. GCloud doesn't support ENV management from GCloud console, so we read secrets and inject them into ENV before starting server.

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
