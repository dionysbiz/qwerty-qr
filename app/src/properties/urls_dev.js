export const url_dev = {
  host: 'dionys.xyz',
  graphql: 'http://kafkaconsumergraphqlsub-dev.dionys.xyz/graphql',
  ws_graphqlSubscription: 'ws://kafkaconsumergraphqlsub-dev.dionys.xyz/subscriptions',
  braintree_verifyCreditCard: 'http://paypalbraintreeserver-dev.dionys.xyz/verifyCreditCard',
  braintree_getClientTokenRequest: 'https://paypalbraintreeserver-dev.dionys.xyz/getClientTokenRequest',
  braintree_createTransaction: 'https://paypalbraintreeserver-dev.dionys.xyz/createTransaction',
  // Remarks: this is a direct link to the backend but not through SDCF
  kafka_publisher: 'http://kafkapublisher-dev.dionys.xyz/sendMsg2KafkaProducer',
  // Remarks: SDCF Feign client call
  //kafka_publisher: 'http://scdf-qrorder-dev.dionys.xyz',
};
