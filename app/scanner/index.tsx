import { Camera, CameraView } from "expo-camera";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import { Button, Modal, Layout,  Text, Spinner } from '@ui-kitten/components';
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';
import { triggerTransactionv2 } from '../src/utils/ethUtil';

export type Props = {
  navigation: any,
};

const qrNull = {
  scanAction: "",
  name: "",
  crypto_name_short: "",
  crypto_contract_addr: "",
  crypto_chain_id: "",
  crypto_price_ezread: "",
  toWalletAddr: ""
}

export default function Home(navigation) {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const params = useLocalSearchParams();
  const { walletAddr } = params;
  // ---------------State variables---------------
  
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [waitingModalVisible, setWaitingModalVisible] = useState(false);

  
  const [qrData, setQrData ] = useState(qrNull);

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

  const connect = async () => {
    try {
      const accounts = (await sdk?.connect()) as string[];
      console.log('accounts', accounts);
      console.log('account', account);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const onTransactionSuccess = async() => {
    qrLock.current = false;
    setWaitingModalVisible(false)
  }

  const onTransactionFail = async() => {
    console.log("Transaction Fail")
    //setTimeout(async () => {
      qrLock.current = false;
      setWaitingModalVisible(false)
    //}, 500); 
  }

  const onQRScan = async (qrCode) => {
    await connect()
    setQrData(qrCode)
    if(qrCode.scanAction === "transfer") {
      setConfirmModalVisible(true)
    } 
  }

  const onCancel = async () => {
    setConfirmModalVisible(false)
    qrLock.current = false;
  }

  const onConfirmTransaction = () => {
    //console.log(account)
    setTimeout(async () => {
      triggerTransactionv2(
        qrData.crypto_chain_id, 
        qrData.crypto_contract_addr, 
        qrData.crypto_name_short, 
        walletAddr, 
        qrData.toWalletAddr, 
        qrData.crypto_price_ezread, 
        onTransactionSuccess(),
        onTransactionFail())
      setConfirmModalVisible(false)
      setWaitingModalVisible(true)
    }, 500); 
    
    
  }

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
    <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.dark}>
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
              //await Linking.openURL(data);
              await onQRScan(JSON.parse(data))
            }, 500);
          }
        }}
      />
      <Overlay />
      <Modal
        visible={confirmModalVisible}
        backdropStyle={styles.confirmBackdrop}
        //onBackdropPress={() => setConfirmModalVisible(false)}
      >
        <Text>Confirm to buy the item</Text>
        <Layout
          style={styles.containerInfo}
          level='1'
        >
        <Text>Item Name: {qrData.name}</Text>
        <Text>Price: {qrData.crypto_price_ezread} {qrData.crypto_name_short}</Text>
        <Text>Receiver Wallet Address:</Text>
        <Text>{qrData.toWalletAddr.substring(0, 25)}..</Text>
        </Layout>
        <Layout
          style={styles.confirmBackdrop}
          level='1'
          justifyContent='center'
        >
          <Button style={styles.button} onPress={() => onConfirmTransaction()}>
            Confirm
          </Button>
          <Button style={styles.button} onPress={() => onCancel()}>
            Cancel
          </Button>
        </Layout>
      </Modal>
      <Modal
        visible={waitingModalVisible}
        backdropStyle={styles.waitingBackdrop}
        //onBackdropPress={() => setConfirmModalVisible(false)}
      >
        <View style={styles.loading}>
          <Spinner />
          <Text>Processing..</Text>
          <Text>Please wait until confirmation from Metamask</Text>
          <Text>The screen may go back & forward a few times</Text>
        </View>
      </Modal>
      
    </SafeAreaView>
    </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  containerButton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  containerInfo: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  button: {
    margin: 2,
  },
  confirmBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  waitingBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});