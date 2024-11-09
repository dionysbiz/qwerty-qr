/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Button, Text } from '@ui-kitten/components';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer,  } from '@react-navigation/native';

import { useSDK } from '@metamask/sdk-react';
import { encrypt } from 'eciesjs';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import packageJSON from '../../../package.json';
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

export function PaymentScreen({ route, navigation }): JSX.Element {
  const [langPack, setLangPack] = useState(en)
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [currentChainId, setCurrentChainId] = useState("");
  const [isSameChain, setIsSameChain] = useState(false);
  

  const { fiatCurrency, 
          targetChainId,
          targetChainName,
          targetBlockExplorerUrls,
          targetNativeCurrency,
          targetRpcUrls
        } = route.params;

  // ---------------navigate function--------------- 
  const navigateHome = () => {
    //navigation.navigate('BuyCryptoScreen');
    navigation.goBack();
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
              blockExplorerUrls: [chain.blockExplorerUrls],
              nativeCurrency: {
                name: chain.nativeCurrency,
                symbol: chain.nativeCurrency,
                decimals: 18
            },
              rpcUrls: [chain.rpcUrls],
            },
          ],
        });
        console.log('addChain', result);
        setResponse(result);
      }
      setCurrentChainId(chain.chainId)
      
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

  const chain={
    chainId: targetChainId,
    chainName: targetChainName,
    blockExplorerUrls: targetBlockExplorerUrls,
    nativeCurrency: targetNativeCurrency,
    rpcUrls: targetRpcUrls
  }

  useEffect(() => {
    //promiseHttpGasPrice()
    setCurrentChainId(chainId)
    
    if (targetChainId === currentChainId) {
      //Alert.alert(currentChainId)
      console.log("do nothing")
      setIsSameChain(true)
    } else {
      const chain={
        chainId: targetChainId,
        chainName: targetChainName,
        blockExplorerUrls: targetBlockExplorerUrls,
        nativeCurrency: targetNativeCurrency,
        rpcUrls: targetRpcUrls
      }
      setIsSameChain(false)
      //addChain2(chain)
    }
    
      
  })

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Button onPress={navigateHome}>
        Back 
      </Button>

      { isSameChain ? 
      <>
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
      </>
      : 
      <>
        <Button onPress={()=>addChain(chain)}>
          Add Chain to Wallet 
        </Button>
      </>
      }


      <Text status='success'>
      {fiatCurrency}
      </Text>
      <Text status='success'>
        Chain From SDK {chainId} {currentChainId}
      </Text>

      <Text status='success'>
      {targetChainId} {targetChainName} {targetBlockExplorerUrls} {targetNativeCurrency} {targetRpcUrls}
      </Text>
      
      
    </SafeAreaView>
  );
}
