import {join} from 'path';

require('dotenv').config({path: join(__dirname, '..', '.env')});

export const config = {
    graphQL: {
        endpoint: process.env.GRAPHQL_ENDPOINT,
    },
    auth: {
        admin_token: process.env.ADMIN_AUTH_TOKEN,
        trader_token: process.env.TRADER_AUTH_TOKEN,
    },
};
