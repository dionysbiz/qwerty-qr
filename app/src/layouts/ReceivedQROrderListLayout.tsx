import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Button, Card, Icon, IconElement, List, ListItem, Layout, Modal, Text  } from '@ui-kitten/components';
import { StyleSheet, Alert, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Realm, useApp, useAuth, useQuery, useRealm, useUser} from '@realm/react';
import { OfflineItemEditCard } from '../components/OfflineItemEditCard'
import {
  QrCodeSvg,
  plainRenderer,
} from 'react-native-qr-svg';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';
import { scanQROrders } from '../../src/utils/awsClient';
import { urls } from '../properties/urls'
//import { Consumer, ConsumerSubscribeTopics, EachBatchPayload, Kafka, EachMessagePayload } from 'kafkajs'

import { useSubscription } from '@apollo/client';
import { MESSAGE_SUBSCRIPTION } from '../../src/utils/graphql/subscriptions'


interface IListItem {
  id: string,
  name: string;
  crypto_name_short: string,
  crypto_contract_addr: string,
  crypto_chain_id: string,
  crypto_price_ezread: string, // short form without 0s
  dateCreate?: Date,
  fromAddr: string,
  txHash: string
}
/*
let data = new Array(16).fill({
  title: 'Title for Item',
  description: 'Description for Item',
});
*/

const QROrderSchema = {
  name: 'OfflineQRItem',
  primaryKey: 'id',
  properties: {
    id: 'string',
    onScreenIdx: 'int',
    name:  'string',
    crypto_name_short: 'string',
    crypto_contract_addr: 'string',
    crypto_chain_id: 'string',
    crypto_price_ezread: 'string', // short form without 0s
    dateCreate: 'date',
    fromAddr: 'string',
    txHash: 'string'
  }
};

const itemNull:IListItem = {
  id: '',
  name: '',
  onScreenIdx: 0,
  toAddr: null,
  chainId: null,
  cryptoNameShort: null,
  cryptoContractAddr: null,
  cryptoPriceEzread: null,
  dateCreate: null,
  fromAddr: null,
  txHash: null
}

/*
const kafka = new Kafka({
  clientId: 'app-qrItemOrder',
  brokers: [urls.kafka_androidEmu2LocalhostPortForward],
  // authenticationTimeout: 10000,
  // reauthenticationThreshold: 10000,
  ssl: true,
  sasl: {
    //kubectl get secret kafkaserver-user-passwords --namespace kafka -o jsonpath='{.data.client-passwords}' | base64 -d | cut -d , -f 1
    mechanism: 'plain', // scram-sha-256 or scram-sha-512
    username: 'superuser',
    password: 'Tdp5n8uxvN'
  },
})
  */


export const ReceivedQROrderListLayout = (): JSX.Element => {
  // ---------------State variables--------------- 
  const [currentLang, setCurrentLang] = useState("en");
  const [itemList, setItemList] = useState<IListItem[] | []>([]);;
  const [orderDetailModalVisible, setOrderDetailModalVisible] = useState(false);
  const [currentViewingItem, setCurrentViewingItem] = useState(itemNull);

  const [topic, setTopic] = useState('testtopic');
  const { data, error } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { topic }, // Pass the topic parameter
  });


  useEffect(() => {
    
    if (data) {
      // Append new message to the list when received
      console.log(data)
      //setMessages((prevMessages) => [...prevMessages, data.messageStream]);
      addKafkaOrderItem2Realm(data.messageStream)
    }
    loadOrderItem2List()
  }, [data]);

  if (error) {
    console.error(error.message)
    console.error(error.stack)
    return <Text>Error: {error.message}</Text>;
  }

  

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
  const topicName = 'qrItemOrder-'+account
  setTopic(topicName)

  const renderItemAccessory = (item): React.ReactElement => (
    <>
    <Button 
      size='tiny' 
      disabled={false} 
      onPress={ () => null
      }>
      Refund
    </Button>
    <Button 
      size='tiny' 
      disabled={false} 
      onPress={ () => null
      }>
      Save
    </Button>
    </>
  );

  const renderItemIcon = (props): IconElement => (
    <Icon
      {...props}
      name='archive-outline'
      
    />
  );

  const renderAddItemIcon = (): IconElement => (
    <MaterialIcons name="playlist-add" size={25} color="white" />
  );

  const renderItem = ({ item, index }: { item: IListItem; index: number }): JSX.Element => (
    <ListItem
      title={`${item.itemName} `}
      description={`${item.createDate} `}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory(item)}
      onPress={() => onClickItemOntheList(item)}
    />
  );

  const onClickItemOntheList = (item:IListItem) => {
    console.log(item.order_id)
    setCurrentViewingItem(item)
    setOrderDetailModalVisible(true)
  }

  const onClickBackGround = () => {
    
    setOrderDetailModalVisible(false)
  }

  const addKafkaOrderItem2Realm = async(kafkaItem) => {
    let order = JSON.parse(kafkaItem)
    /*
    id: 'string',
    onScreenIdx: 'int',
    name:  'string',
    crypto_name_short: 'string',
    crypto_contract_addr: 'string',
    crypto_chain_id: 'string',
    crypto_price_ezread: 'string', // short form without 0s
    dateCreate: 'date',
    fromAddr: 'string',
    */
    createQROrderItem(
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
    )
  }

  const createQROrderItem = (
    id: string,
    onScreenIdx: number,
    name: string,
    crypto_name_short: string,
    crypto_contract_addr: string,
    crypto_chain_id: string,
    crypto_price_ezread: string,
    dateCreate: Date,
    fromAddr: string,
    txHash: string,
  ) => {
    let realm = new Realm({schema: [QROrderSchema]});
    //write to local Database
    realm.write(() => {
      let item = realm.create('QROrderItem', {
        id: id,
        onScreenIdx: onScreenIdx,
        name:  name,
        crypto_name_short: crypto_name_short,
        crypto_contract_addr: crypto_contract_addr,
        crypto_chain_id: crypto_chain_id,
        crypto_price_ezread: crypto_price_ezread, // short form without 0s
        dateCreate: dateCreate,
        fromAddr: fromAddr,
        txHash: txHash
      });
    });
  }

  const loadOrderItem2List = async() => {
    
    let realm = new Realm({schema: [QROrderSchema]});
    let data = [{name: 'FirstItemname', description: 'DescripTioN'}]
    data=[]

    Realm.open({schema: [QROrderSchema]})
    .then(realm => {
      // ... use the realm instance to read and modify data
      let realmItemList = realm.objects('QROrderItem')
      realmItemList = realmItemList!.sorted("dateCreate", false)

      for (let p of realmItemList) {
        let item:IListItem = {
          id: String(p.id),
          name: String(p.name), 
          crypto_name_short: String((p.crypto_name_short)),
          crypto_contract_addr: String((p.crypto_contract_addr)),
          crypto_chain_id: String((p.crypto_chain_id)),
          crypto_price_ezread: String((p.crypto_price_ezread)),
          dateCreate: new Date(p.dateCreate),
          fromAddr: String(p.fromAddr),
          txHash: String(p.txHash),
        }
        data.push(item)
      }

      setItemList(data)
      realm.close();
    })
  }

  const loadOrderItem2ListFromAWS = async() => {
    
    const jsonStr = await scanQROrders(account)
    //const receivedQRorderListJSON = JSON.parse(jsonStr)
    console.log(jsonStr)
    let receivedQRorderList = []
    /*
    order_id: '',
    onScreenIdx: 0,
    toAddr: null,
    chainId: null,
    cryptoNameShort: null,
    cryptoContractAddr: null,
    cryptoPriceEzread: null,
    createDate: null,
    fromAddr: null,
    
    */
    await jsonStr.forEach((item) => {
      console.log(item)
      const order = {
        order_id: item.order_id.S,
        itemName: item.itemName.S,
        toAddr: item.toAddr.S,
        chainId: item.chainId.S,
        cryptoNameShort: item.cryptoNameShort.S,
        //cryptoContractAddr: item.cryptoContractAddr.S,
        cryptoPriceEzread: item.cryptoPriceEzread.S,
        createDate: item.createDate.S,
        fromAddr: item.fromAddr.S,
      }
      receivedQRorderList.push(order)
    });
    console.log("When it is done")
    //console.log(receivedQRorderList)
    setItemList(receivedQRorderList)
  }
  

  //--------------------------------------------

  const eth_estimationGas = async (to, value) => {
    console.log('to', to);
    console.log('value', value);
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
      console.log('eth_estimationGas', result);
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
      console.log('eth_gasPrice', result);
      return result;
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  const SIZE = 170;

  return (
    <View style={styles.container}>
      
      <Layout>
        <Layout
          style={styles.rowContainer}
          level='1'
        >
       </Layout> 

        <Layout
          style={styles.rowContainer}
          level='1'
        >
          <Text category='h5'>
            Received Orders
          </Text>
          <Button
            style={styles.addItemButton}
            appearance='ghost'
            accessoryLeft={renderAddItemIcon}
            onPress={ () => null}
          />
        </Layout>

        <List
          style={styles.container}
          data={itemList}
          renderItem={renderItem}
        />
      </Layout>

    </View>
    
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '100%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addItemButton: {
    margin: 2,
  },
  //QR code related
  qrroot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrcontent: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrbox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qricon: {
    fontSize: 20,
  },
  qr: {
    padding: 15,
  },
});