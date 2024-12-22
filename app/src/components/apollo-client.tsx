// apollo-client.js
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { getMainDefinition } from '@apollo/client/utilities';

import { url } from '../properties/urls_local'

// HTTP link for regular queries and mutations

//kubectl port-forward service/kafkaconsumergraphqlsub-dev 8080:8080 -n kafkaconsumergraphqlsub-dev
const httpLink = new HttpLink({
  uri: url.graphql, // Your GraphQL server's HTTP URL
});

// WebSocket link for subscriptions

const wsLink = new GraphQLWsLink(createClient({
  url: url.ws_graphqlSubscription,
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