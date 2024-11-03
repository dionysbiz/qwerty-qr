// MessageList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSubscription } from '@apollo/client';
import { MESSAGE_SUBSCRIPTION } from './subscriptions';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

export function MessageList(): JSX.Element {
  const { data, error } = useSubscription(MESSAGE_SUBSCRIPTION);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data) {
      // Append new message to the list when received
      setMessages((prevMessages) => [...prevMessages, data.messageStream]);
    }
  }, [data]);

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Messages</Text>
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