// MessageList.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { useSubscription } from '@apollo/client';
import { MESSAGE_SUBSCRIPTION } from './subscriptions';
//import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
//import { createClient } from 'graphql-ws';

export function MessageList(): JSX.Element {
  const [topic, setTopic] = useState('testtopic');
  const { data, error } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { topic }, // Pass the topic parameter
  });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data) {
      // Append new message to the list when received
      //console.log(data)
      setMessages((prevMessages) => [...prevMessages, data.messageStream]);
    }
  }, [data]);

  if (error) {
    console.error(error.message)
    console.error(error.stack)
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Messages</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Messages for Topic: {topic}</Text>
      
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 16,
        }}
        placeholder="Enter topic"
        value={topic}
        onChangeText={setTopic}
      />
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}