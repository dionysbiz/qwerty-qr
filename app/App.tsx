/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'node-libs-expo/globals';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import React, { useEffect } from 'react';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppNavigator } from './navigation.component';

//import { COMM_SERVER_URL, INFURA_API_KEY } from '@env';
import {
  MetaMaskProvider,
  SDKConfigProvider,
  useSDKConfig,
} from '@metamask/sdk-react';
import { AppState, AppStateStatus, Linking, LogBox } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { StorageManagerRN } from './src/StorageManagerRN';

LogBox.ignoreLogs([
  'Possible Unhandled Promise Rejection',
  'Message ignored because invalid key exchange status',
  "MetaMask: 'ethereum._metamask' exposes",
  '`new NativeEventEmitter()` was called with a non-null',
]); // Ignore log notification by message

// TODO how to properly make sure we only try to open link when the app is active?
// current problem is that sdk declaration is outside of the react scope so I cannot directly verify the state
// hence usage of a global variable.
let canOpenLink = true;

/*
const WithSDKConfig = ({ children }: { children: React.ReactNode }) => {
  const {
    socketServer,
    infuraAPIKey,
    useDeeplink,
    debug,
    checkInstallationImmediately,
  } = useSDKConfig();

  return (
    <MetaMaskProvider
      debug={debug}
      sdkOptions={{
        communicationServerUrl: socketServer,
        enableAnalytics: true,
        infuraAPIKey,
        readonlyRPCMap: {
          '0x539': process.env.NEXT_PUBLIC_PROVIDER_RPCURL ?? '',
        },
        logging: {
          developerMode: true,
          plaintext: true,
        },
        openDeeplink: (link: string, _target?: string) => {
          console.debug(`App::openDeepLink() ${link}`);
          if (canOpenLink) {
            Linking.openURL(link);
          } else {
            console.debug(
              'useBlockchainProiver::openDeepLink app is not active - skip link',
              link,
            );
          }
        },
        timer: BackgroundTimer,
        useDeeplink,
        checkInstallationImmediately,
        storage: {
          enabled: true,
          storageManager: new StorageManagerRN()
        },
        dappMetadata: {
          name: 'qwerty-qr',
        },
        i18nOptions: {
          enabled: true,
        },
      }}
    >
      {children}
    </MetaMaskProvider>
  );
};
*/

export default function App() {
  const handleAppState = (appState: AppStateStatus) => {
    canOpenLink = appState === 'active';
    console.debug(`AppState change: ${appState} canOpenLink=${canOpenLink}`);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleNavReady = () => {
    console.log('Navigation container ready!');
  };

  const {
    socketServer,
    infuraAPIKey,
    useDeeplink,
    debug,
    checkInstallationImmediately,
  } = useSDKConfig();

  return (
    /*
    <SDKConfigProvider
      //initialSocketServer={COMM_SERVER_URL}
      //initialInfuraKey={INFURA_API_KEY}
      initialSocketServer="https://metamask-sdk-socket.metafi.codefi.network"
      initialInfuraKey="139a076676e1447094981c79ac0b6acc"
    >
      <WithSDKConfig>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.dark}>
          <AppNavigator/>
        </ApplicationProvider>
      </WithSDKConfig>
    </SDKConfigProvider>
    */
   
    <MetaMaskProvider
      debug={debug}
      sdkOptions={{
        communicationServerUrl: socketServer,
        enableAnalytics: true,
        infuraAPIKey,
        readonlyRPCMap: {
          '0x539': process.env.NEXT_PUBLIC_PROVIDER_RPCURL ?? '',
        },
        logging: {
          developerMode: true,
          plaintext: true,
        },
        openDeeplink: (link: string, _target?: string) => {
          console.debug(`App::openDeepLink() ${link}`);
          if (canOpenLink) {
            Linking.openURL(link);
          } else {
            console.debug(
              'useBlockchainProiver::openDeepLink app is not active - skip link',
              link,
            );
          }
        },
        timer: BackgroundTimer,
        useDeeplink,
        checkInstallationImmediately,
        storage: {
          enabled: true,
          //storageManager: new StorageManagerRN()
        },
        dappMetadata: {
          name: 'qwerty-qr',
          url: 'http://www.nono.com',
        },
        i18nOptions: {
          enabled: true,
        },
      }}
    >
      <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.dark}>
          <AppNavigator/>
        </ApplicationProvider>
    </MetaMaskProvider>
   
   
  );
}