## NFT Marketplace Blockchain

Included dev.Dockerfile and docker-compose files to make the local development easy

**Instructions**

- Install docker compose.

- In the root directory do

docker-compose down : for stop the containers

## Prod Setup

- Clone repo
- Rename file `.env.sample` into `.env`
- Fill the missing values in the `.env`
- Rename file `config/arweaveKey-sample.js` into `config/arweaveKey.js`
- Fill the missing values in the `arweaveKey.js`

-  **TO START** run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
