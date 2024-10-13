import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';


export function OfflineQRMenuScreen({}): JSX.Element {
  // ---------------State variables--------------- 

  // ---------------Style Sheets---------------
  const styles = StyleSheet.create({
    offlineQRMenuScreen: {
      flex: 1,
      backgroundColor: '#BFEFFF',
    },
  });
  return (
  <>
    <View style={styles.offlineQRMenuScreen}>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category='h1'>ORDERS</Text>
      </Layout>

    </View>
    
  </>
  )
}