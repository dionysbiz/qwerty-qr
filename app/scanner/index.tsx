import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef } from "react";
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';

export type Props = {
  navigation: any,
};

export default function Home(navigation) {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  // ---------------State variables--------------- 

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

  // ---------------Style Sheets---------------

  // ---------------Visual Items--------------- 

  // ---------------onPress Handler---------------

  // ---------------navigate function---------------
  const eth_estimationGas = async (to, value) => {
    try {
      const result = await ethereum?.request({
        method: 'eth_estimateGas',
        params: [
          {
            from: account,
            to: to,
            value: value
          }
        ]
      });
      console.log('eth_sendTransaction', result);
      return result;
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  const eth_gasPrice = async () => {
    try {
      const result = await ethereum?.request({
        method: 'eth_gasPrice',
        params: [
        ]
      });
      console.log('eth_sendTransaction', result);
      return result;
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  const sendTransaction = async (qr:any) => {
    try {
        const value = Web3.utils.toWei(qr.crypto_price_ezread, 'ether')
        const gas = eth_estimationGas(qr.toWalletAddr, value)
        const gasPrice = eth_gasPrice()
        console.log('value', value);
        console.log('gas', gas);
        console.log('gasPrice', gasPrice);

        /*
        const result = await ethereum?.request({
          method: 'eth_sendTransaction',
          params: [
            {
              to: qr.toWalletAddr,
              from: account,
              gas: gas,
              value: value,
              gasPrice: gasPrice
            }
          ]
        });
        console.log('eth_sendTransaction', result);
        */
        //setResponse(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              await Linking.openURL(data);
            }, 500);
          }
        }}
      />
      <Overlay />
    </SafeAreaView>
  );
}