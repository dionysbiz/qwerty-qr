import React, { useState } from 'react';
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { MessageList } from '../components/MessageList'
import { ApolloProvider } from '@apollo/client';
import client  from '../components/apollo-client';

export function LogisticScreen({}): JSX.Element {
  // ---------------State variables--------------- 

  // ---------------Style Sheets---------------
  const styles = StyleSheet.create({
    logistic: {
      flex: 1,
      backgroundColor: '#BFEFFF',
    },
  });
  return (
  <>
    <View style={styles.logistic}>
      <ApolloProvider client={client}>
        <MessageList />
      </ApolloProvider>
    </View>

  </>
  )
}