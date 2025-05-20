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
import { OfflineQRMenuListLayout } from "../layouts/OfflineQRMenuListLayout"
import { ReceivedQROrderListLayout } from "../layouts/ReceivedQROrderListLayout"
import { Layout, Text, TabView } from '@ui-kitten/components';
import { Icon, IconElement, Tab, TabBar, TabBarProps } from '@ui-kitten/components';
import { ApolloProvider } from '@apollo/client';
import client  from '../components/apollo-client';

export function ShopManagementScreen({ langPack, walletAddr, currentChainId }): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const styles = StyleSheet.create({
    shopManagement: {
      flex: 1,
      backgroundColor: '#FFEBCD',
    },
    tabContainer: {
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <>
      <TabView
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
    >
      {/*
      <Tab title='Shop Items'>
        <Layout style={styles.tabContainer}>
          <Text category='h5'>
USERS
          </Text>
        </Layout>
      </Tab>
      */}
      <Tab title={langPack.shopManagementScreen_tabtitle_qrmenu}>
        <OfflineQRMenuListLayout 
          langPack={langPack}
          walletAddr={walletAddr}
          currentChainId={currentChainId} 
          isFocused={selectedIndex === 0}
        />
      </Tab>
      <Tab title={langPack.shopManagementScreen_tabtitle_receivedorder}>

        <ApolloProvider client={client}>
          <ReceivedQROrderListLayout 
            langPack={langPack} 
            walletAddr={walletAddr}
            isFocused={selectedIndex === 1}
          />
        </ApolloProvider>

      </Tab>
    </TabView>
    </>
  )
}