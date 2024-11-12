import React, { useState, useEffect, useRef } from 'react';
import {
  AppState,
  Linking,
  Platform,
  Pressable,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { Button, Modal, Layout } from '@ui-kitten/components';

import { Overlay } from "./QRScannerOverlay";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { useSDK } from '@metamask/sdk-react';
import { triggerTransactionv2 } from '../utils/ethUtil';


export function CameraScreen({}): JSX.Element {
  // ---------------State variables--------------- 
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [qrData, setQrData ] = useState(null);

  
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

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

  const onQRScan = (qrCode) => {
    setQrData(qrCode)
    if(qrCode.scanAction === "transfer") {
      setConfirmModalVisible(true)
    } 
  }

  const onConfirmTransaction = () => {
    triggerTransactionv2(
      qrData.crypto_chain_id, 
      qrData.crypto_contract_addr, 
      qrData.crypto_name_short, 
      account, 
      qrData.toWalletAddr, 
      qrCode.crypto_price_ezread, 
      null,
      null)
  }

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
  <>
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            onQRScan(data)
            setTimeout(async () => {
              //await Linking.openURL(data);
            }, 500);
          }
        }}
      />
      <Overlay />
      <Modal
        visible={confirmModalVisible}
        backdropStyle={styles.confirmBackdrop}
        onBackdropPress={() => setConfirmModalVisible(false)}
      >
        <Text> Confirm to buy the item</Text>
        <Text>
          Item Name: ${qrData.name}
          Price: ${qrData.crypto_price_ezread} ${qrData.crypto_name_short}
          Receiver Wallet Address:
          ${qrData.toWalletAddr}    
        </Text>
        <Layout
          style={styles.container}
          level='1'
        >
          <Button style={styles.button} onPress={() => onConfirmTransaction()}>
            Confirm
          </Button>
          <Button style={styles.button} onPress={() => setConfirmModalVisible(false)}>
            Cancel
          </Button>
        </Layout>
      </Modal>
    </SafeAreaView>
  </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 2,
  },
  confirmBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});