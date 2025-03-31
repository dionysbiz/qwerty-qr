// apollo-client.js
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { getMainDefinition } from '@apollo/client/utilities';

import { url_local } from '../properties/urls_local'
import { url_dev } from '../properties/urls_dev'

import DeviceInfo from 'react-native-device-info'

var url:any = ""

DeviceInfo.isEmulator().then((isEmulator) => {
  if (isEmulator) {
    //url = url_local;
    url = url_dev;
  } else {
    url = url_dev;
  }
});

// HTTP link for regular queries and mutations

//kubectl port-forward service/kafkaconsumergraphqlsub-dev 8080:8080 -n kafkaconsumergraphqlsub-dev
const httpLink = new HttpLink({
  //uri: url.graphql, // Your GraphQL server's HTTP URL
  uri: 'http://kafkaconsumergraphqlsub-dev.dionys.xyz/graphql',
  //uri: 'http://10.0.2.2:8080/graphql',
});

// WebSocket link for subscriptions

const wsLink = new GraphQLWsLink(createClient({
  //url: url.ws_graphqlSubscription,
  //url: 'ws://10.0.2.2:8080/subscriptions',
  url: 'ws://kafkaconsumergraphqlsub-dev.dionys.xyz/subscriptions',
  keepAlive: 10000, // Sends a keep-alive message every 10 seconds
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