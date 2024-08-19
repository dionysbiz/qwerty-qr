/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';

import { useSDK } from '@metamask/sdk-react';
import { encrypt } from 'eciesjs';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import packageJSON from '../../package.json';
import PropTypes from 'prop-types';
import { TopNavbar } from '../layouts/dashboard/TopNavbar';
import { DAPPView } from '../views/DappView';

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

export function DemoScreen({}): JSX.Element {
  const [langPack, setLangPack] = useState(en)

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

  const testEncrypt = async () => {
    // const privateKey =
    //   '0x131ded88ca58162376374eecc9f74349eb90a8fc9457466321dd9ce925beca1a';
    console.debug('begin encryption test');
    const startTime = Date.now();

    const data =
      '{"type":"originator_info","originatorInfo":{"url":"example.com","title":"React Native Test Dapp","platform":"NonBrowser"}}';
    const other =
      '024368ce46b89ec6b5e8c48357474b2a8e26594d00cd59ff14753f8f0051706016';
    const payload = Buffer.from(data);
    const encryptedData = encrypt(other, payload);
    const encryptedString = Buffer.from(encryptedData).toString('base64');
    console.debug('encrypted: ', encryptedString);
    const timeSpent = Date.now() - startTime;
    setEncryptionTime(timeSpent);
    console.debug(`encryption time: ${timeSpent} ms`);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: 10,
            backgroundColor: Colors.white,
          }}
        >
          {/*
          <Text style={{ color: Colors.black, fontSize: 24 }}>
            expo-demo Mobile Dapp Test ( RN{' '}
            {`v${packageJSON.dependencies['react-native']
              .trim()
              .replaceAll('\n', '')}`}
            )
          </Text>
 
          */}
          <TopNavbar onOpenSidebar={() => 
            setNavbarOpen(true)} 
            onConnect={connectWithMetamask}
            onAddChain={addChain} 
            onChangeLang={handleLangChange} 
            langPack={langPack}
          />
          
          {/* 
            <Button title="TestEncrypt" onPress={testEncrypt} />
            <Text style={{ color: Colors.black }}>
              {encryptionTime && `Encryption time: ${encryptionTime} ms`}
            </Text>
          */}

          <DAPPView />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
