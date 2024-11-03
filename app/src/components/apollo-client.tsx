// apollo-client.js
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { getMainDefinition } from '@apollo/client/utilities';

// HTTP link for regular queries and mutations
const httpLink = new HttpLink({
  uri: 'http://10.0.2.2:8080/graphql', // Your GraphQL server's HTTP URL
});

// WebSocket link for subscriptions

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://10.0.2.2:8080/subscriptions',
}));



// Split links between WebSocket and HTTP based on the operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;