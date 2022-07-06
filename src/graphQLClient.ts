import {GraphQLClient} from 'graphql-request';
import {config} from './config';

export const gql_client = new GraphQLClient(config.graphQL.endpoint);
