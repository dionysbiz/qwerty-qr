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
import { Layout, Text, TabView } from '@ui-kitten/components';
import { Icon, IconElement, Tab, TabBar, TabBarProps } from '@ui-kitten/components';


export function ShopManagementScreen({}): JSX.Element {
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
      <Tab title='QR Menu'>
        <OfflineQRMenuListLayout/>
      </Tab>
      <Tab title='Received Orders'>
        <Layout style={styles.tabContainer}>
          <Text category='h5'>
          Received Orders
          </Text>
        </Layout>
      </Tab>
    </TabView>
    </>
  )
}