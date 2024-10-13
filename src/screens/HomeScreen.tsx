import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Text, StatusBar, SafeAreaView, useColorScheme,  } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { zhHK, en } from '../translate';

import { PaymentScreen } from './PaymentScreen';
import { NavigationContainer } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

export type Props = {
  navigation: any,
};

export const HomeScreen = ({ navigation }) : JSX.Element => {
  // ---------------State variables--------------- 
  

  // ---------------Style Sheets--------------- 
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  
  // ---------------Visual Items--------------- 
  const isDarkMode = useColorScheme() === 'dark';

  
  // ---------------navigate function--------------- 


  
  const navigatePayment = () => {
    navigation.navigate('PaymentScreen');
  };

  // ---------------onPress Handler---------------
  
  

  //useEffect(() => {})

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <Divider/>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={navigatePayment}>OPEN Payment Demo screen</Button>
      </Layout>
    </SafeAreaView>
  );
};