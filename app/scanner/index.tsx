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
//import { useSDK } from '@metamask/sdk-react';
//import Web3 from 'web3';
import { triggerTransactionv2 } from '../src/utils/ethUtil';
import { putQrorder, scanQROrders } from '../src/utils/awsClient';

import { url_local } from '../src/properties/urls_local'
import { url_dev } from '../src/properties/urls_dev'

import DeviceInfo from 'react-native-device-info'


var url:any = ""

DeviceInfo.isEmulator().then((isEmulator) => {
  if (isEmulator) {
    url = url_local;
  } else {
    url = url_dev;
  }
});


var hash = require('object-hash');

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
/*
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
   */

  // ---------------Style Sheets---------------

  // ---------------Visual Items--------------- 

  // ---------------onPress Handler---------------

  /*
  const connect = async () => {
    try {
      const accounts = (await sdk?.connect()) as string[];
      console.log('accounts', accounts);
      console.log('account', account);
    } catch (e) {
      console.log('ERROR', e);
    }
  };
  */

  const onTransactionSuccess = async(txHash) => {
    qrLock.current = false;
    setWaitingModalVisible(false)
    //console.log("ON Success after coming back from Metamask")
    console.log("TxHash has been returned from Metamask but not yet confirmed:")
    console.log(txHash)
    // send qrData And receipt to Kafka with topic
    const topicName = 'qrItemOrder-'+qrData.toWalletAddr
    const orderTime = new Date()

    // This is for putting to AWS dynamoDB
    const qrorderItem = {
      chainId: { S: qrData.crypto_chain_id },
      itemName: { S: qrData.name},
      fromAddr: { S: walletAddr },
      toAddr: { S: qrData.toWalletAddr },
      cryptoNameShort: {S: qrData.crypto_name_short },
      cryptoPriceEzread: { S: qrData.crypto_price_ezread },
      cryptoContractAddr: {S: qrData.crypto_contract_addr },
      transactionHash: {S: txHash},
      createDate: {S: orderTime}
    }

    fetch(url.kafka_publisher, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        topic: topicName
      },
      body: JSON.stringify({
        /* receive side JSONparse
        order.id,
        itemList.length,//?
        order.name,
        order.crypto_name_short,
        order.crypto_contract_addr,
        order.crypto_chain_id,
        order.crypto_price_ezread,
        order.dateCreate,
        order.fromAddr,
        order.txHash
        */
        id: hash(qrorderItem),
        name: qrData.name,
        crypto_name_short: qrData.crypto_name_short,
        crypto_contract_addr: qrData.crypto_contract_addr,
        crypto_chain_id: qrData.crypto_chain_id,
        crypto_price_ezread: qrData.crypto_price_ezread,
        dateCreate: orderTime,
        fromAddr: walletAddr,
        txHash: txHash,
      }),
    }
    ).then((response) => {
      console.log("Response from SCDF kafkapublisher feign client")
      console.log(response);
    })
    
  }

  const onTransactionFail = async() => {
    console.log("Transaction Fail")
    console.log("ON Fail after coming back from Metamask")
    //setTimeout(async () => {
      qrLock.current = false;
      setWaitingModalVisible(false)
    //}, 500); 
  }

  const onQRScan = async (qrCode) => {
    //await connect()
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
      
      if (qrData.crypto_price_ezread==='0') {
        const topicName = 'qrItemOrder-'+qrData.toWalletAddr
        // "order_id, chainId, fromAddr, toAddr, product_name, description, currencyName, product_price, transactionHash",
        // Putting order to AWS dynamoDB
        const qrorderItem = {
            chainId: { S: qrData.crypto_chain_id },
            itemName: { S: qrData.name},
            fromAddr: { S: walletAddr },
            toAddr: { S: qrData.toWalletAddr },
            cryptoNameShort: {S: qrData.crypto_name_short },
            cryptoPriceEzread: { S: qrData.crypto_price_ezread },
            cryptoContractAddr: {S: qrData.crypto_contract_addr },
            transactionHash: {S: "NA"},
            createDate: {S: new Date()}
        }
        const order_id = hash(qrorderItem)
        qrorderItem.order_id = {S: order_id}
        //putQrorder(qrorderItem)
        
        // putting order to 
        fetch(url.kafka_publisher, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            topic: topicName
          },
          body: JSON.stringify({
            /* receive side JSONparse
            order.id,
            itemList.length,//?
            order.name,
            order.crypto_name_short,
            order.crypto_contract_addr,
            order.crypto_chain_id,
            order.crypto_price_ezread,
            order.dateCreate,
            order.fromAddr,
            order.txHash
            */
            id: hash(qrorderItem),
            name: qrData.name,
            crypto_name_short: qrData.crypto_name_short,
            crypto_contract_addr: qrData.crypto_contract_addr,
            crypto_chain_id: qrData.crypto_chain_id,
            crypto_price_ezread: qrData.crypto_price_ezread,
            dateCreate: new Date(),
            fromAddr: walletAddr,
            txHash: "0x5e5c7a8610d5b420f77f755924264d89694513bded62762de2bd41d967bd5b30",
          }),
        }).then((response) => {
          console.log("Response from SCDF kafkapublisher feign client")
          console.log(response);
        })
        
        setConfirmModalVisible(false)
        setWaitingModalVisible(true)
        setTimeout(async () => {
          setWaitingModalVisible(false)
        }, 300); 
      } else {
        triggerTransactionv2(
          qrData.crypto_chain_id, 
          qrData.crypto_contract_addr, 
          qrData.crypto_name_short, 
          walletAddr, 
          qrData.toWalletAddr, 
          qrData.crypto_price_ezread, 
          onTransactionSuccess,
          onTransactionFail)
        setConfirmModalVisible(false)
        setWaitingModalVisible(true)
      }
      
    }, 500); 
    
    
  }

  // ---------------navigate function---------------
  /*
  const eth_estimationGas = async (to, value) => {
    try {
      const result = await ethereum?.request({
        method: 'eth_estimateGas',
        params: [
          {
            from: walletAddr,
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
  */
  /*
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
        **
        //setResponse(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };
  */
  

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