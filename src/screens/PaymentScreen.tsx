/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Button, Text } from '@ui-kitten/components';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';

import { useSDK } from '@metamask/sdk-react';
import { encrypt } from 'eciesjs';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import packageJSON from '../../package.json';
import PropTypes from 'prop-types';
import { TopNavbar } from '../layouts/dashboard/TopNavbar';
import { PaymentView } from '../views/PaymentView';

import { zhHK, en } from '../translate';

// ----------------------------------------------------------------------

const [langPack, setLangPack] = useState(en)

const handleLangChange = (lang: string) => {
  switch (lang) {
    case 'zhHK':
      setLangPack(zhHK);
      break;
    case 'en':
      setLangPack(en);
      break;
    default:
      setLangPack(en);
  }
};

export type Props = {
  navigation: any,
};

export function PaymentScreen({ navigation }): JSX.Element {
  const [langPack, setLangPack] = useState(en)

  // ---------------navigate function--------------- 
  const navigateHome = () => {
    navigation.navigate('BuyCryptoScreen');
  };

  const handleLangChange = (langIndex: any) => {
    console.log(langIndex)
    switch (langIndex) {
      case '1':
        setLangPack(zhHK);
        break;
      case '0':
        setLangPack(en);
        break;
      default:
        setLangPack(en);
    }
  };
  
  const isDarkMode = useColorScheme() === 'dark';
  const [encryptionTime, setEncryptionTime] = useState<number>();
  const {
    sdk,
    provider: ethereum,
    status,
    chainId,
    account,
    balance,
    readOnlyCalls,
    connected,
  } = useSDK();
  const [response, setResponse] = useState<unknown>('');

  const [navbarOpen, setNavbarOpen] = useState(false);

  const connectWithMetamask = async () => {
    try {
      const accounts = (await sdk?.connect()) as string[];
      console.log('accounts', accounts);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const addChain = async (chain:any) => {
    try {
      setResponse('');
      console.log("call addChain")
      console.log("chain",chain)
      console.log("chainId",chain.chainId)
      console.log("chainName",chain.chainName)
      console.log("blockExplorer",chain.blockExplorerUrls)
      console.log("nativeCurrency",chain.nativeCurrency)
      console.log("rpcUrls",chain.rpcUrls)
      if (chain.chainId==='0x1') {
        setResponse('');
        const result = await ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: chain.chainId,
            },
          ],
        });
        console.log('switchChain', result);
        setResponse(result);
      } else {
        const result = await ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chain.chainId,
              chainName: chain.chainName,
              blockExplorerUrls: chain.blockExplorerUrls,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls,
            },
          ],
        });
        console.log('addChain', result);
        setResponse(result);
      }
      
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  if (!sdk) {
    return <Text>SDK loading</Text>;
  }

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Button onPress={navigateHome}>
        Back
      </Button>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: 10,
            backgroundColor: Colors.white,
          }}
        >
          <PaymentView />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
