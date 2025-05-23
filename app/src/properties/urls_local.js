export const url_local = {
  // kubectl port-forward service/kafkaserver 9092:9092
  host: '10.0.2.2',
  graphql: 'http://10.0.2.2:8080/graphql',
  ws_graphqlSubscription: 'ws://10.0.2.2:8080/subscriptions',
  braintree_verifyCreditCard: 'http://10.0.2.2:8088/verifyCreditCard',
  braintree_getClientTokenRequest: 'http://10.0.2.2:8088/getClientTokenRequest',
  braintree_createTransaction: 'http://10.0.2.2:8088/createTransaction',
  // Remarks: this is a direct link to the backend but not through SDCF
  kafka_publisher: 'http://10.0.2.2:8088/sendMsg2KafkaProducer',
};
