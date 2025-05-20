import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Card, Icon, IconElement, List, ListItem, Layout, Modal, Text  } from '@ui-kitten/components';
import {StyleSheet, Alert, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Realm, useApp, useAuth, useQuery, useRealm, useUser} from '@realm/react';
import { useSDK } from '@metamask/sdk-react';
import { scanQROrders } from '../../src/utils/awsClient';
import { QROrderViewCard } from '../components/QROrderViewCard'
import { useSubscription } from '@apollo/client';
import { MESSAGE_SUBSCRIPTION } from '../../src/utils/graphql/subscriptions'
import { triggerTransactionv2 } from '../../src/utils/ethUtil';



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
  name: 'QROrderItem',
  primaryKey: 'id',
  properties: {
    id: 'string',
    onScreenIdx: 'int',
    name: 'string',
    crypto_name_short: 'string',
    crypto_contract_addr: 'string',
    crypto_chain_id: 'string',
    crypto_price_ezread: 'string', // short form without 0s
    dateCreate: 'date',
    fromAddr: 'string',
    txHash: 'string'
  }
};

const ArchivedQROrderSchema = {
  name: 'ArchivedQROrderItem',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
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


export const ReceivedQROrderListLayout = ({langPack, walletAddr, isFocused}): JSX.Element => {
  // ---------------State variables--------------- 
  const [currentLang, setCurrentLang] = useState("en");
  const [itemList, setItemList] = useState<IListItem[] | []>([]);;
  const [archivedItemList, setArchivedItemItemList] = useState<IListItem[] | []>([]);;
  const [orderDetailModalVisible, setOrderDetailModalVisible] = useState(false);
  const [archivedOrderDetailModalVisible, setArchivedOrderDetailModalVisible] = useState(false);

  const [deleteOrderConfirmModalVisible, setDeleteOrderConfirmModalVisible] = useState(false);
  const [deleteArchivedOrderConfirmModalVisible, setDeleteArchivedOrderConfirmModalVisible] = useState(false);
  const [currentViewingItem, setCurrentViewingItem] = useState(itemNull);
  const [currentEditingOrder, setCurrentEditingOrder] = useState(itemNull);

  //const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);


  const [topic, setTopic] = useState('testtopic');
  const { data, error } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { topic }, // Pass the topic parameter
  });
  //const [messages, setMessages] = useState([]);

  
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
  
  /*
  useEffect(() => {

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground');
        // Reload the list of received orders when the app comes back to the foreground
        loadOrderItem2List();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };

  }, [appState]);
  */

  useEffect(() => {

    if (isFocused) {
      console.log('ReceivedQROrderListLayout is focused');
      // Perform actions when the screen is focused
      loadOrderItem2List()

    } else {
      console.log('ReceivedQROrderListLayout is not focused');
      // Perform actions when the screen is unfocused
    }
  }, [isFocused]);

  useEffect(() => {
    //const realm = new Realm({ schema: [QROrderSchema,ArchivedQROrderSchema] });
    console.log("useEffect QR Order")

    // GraphQL subscription
    const topicName = 'qrItemOrder-'+account
    console.log('Listen to kafka topic: '+topicName)
    setTopic(topicName)
    
    if (data) {
      // Append new message to the list when received
      console.log(data)
      //setMessages((prevMessages) => [...prevMessages, data.messageStream]);
      addKafkaOrderItem2Realm(data.messageStream)
    }

    loadOrderItem2List()
    setTimeout(function (){loadArchivedOrderItem2List()}, 1000)

  }, [data]);

  if (error) {
    console.error(error.message)
    console.error(error.stack)
    //return <Text>Error: {error.message}</Text>;
  }

  const renderItemAccessory = (item): React.ReactElement => (
    <>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => {
        setCurrentEditingOrder(item)
        setDeleteOrderConfirmModalVisible(true)
      }}>
      {langPack.receivedQROrderListLayout_list_btn_delete}
    </Button>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => {
        triggerTransactionv2(
          item.crypto_chain_id, 
          item.crypto_contract_addr, 
          item.crypto_name_short, 
          walletAddr, 
          item.fromAddr, //Buyers address
          item.crypto_price_ezread, 
          null, //onTransactionSuccess
          null) //onTransactionFail
        }
      }>
      {langPack.receivedQROrderListLayout_list_btn_refund}
    </Button>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => saveQROrder((item))
      }>
      {langPack.receivedQROrderListLayout_list_btn_save}
    </Button>
    </>
  );

  const renderArchivedOrderAccessory = (item): React.ReactElement => (
    <>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => {
        setCurrentEditingOrder(item)
        setDeleteArchivedOrderConfirmModalVisible(true)
      }}>
      {langPack.receivedQROrderListLayout_list_btn_delete}
    </Button>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => null
      }>
      {langPack.receivedQROrderListLayout_list_btn_refund}
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
      title={`${item.name} `}
      description={`${item.id} `}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory(item)}
      onPress={() => onClickItemOntheList(item)}
    />
  );

  const renderArchivedItem = ({ item, index }: { item: IListItem; index: number }): JSX.Element => (
    <ListItem
      title={`${item.name} `}
      description={`${item.id} `}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderArchivedOrderAccessory(item)}
      onPress={() => onClickArchivedOrderOntheList(item)}
    />
  );

  const onClickItemOntheList = (item:IListItem) => {
    console.log("item clicked", item)
    setCurrentViewingItem(item)
    setCurrentEditingOrder(item)
    setOrderDetailModalVisible(true)
  }

  const onClickArchivedOrderOntheList = (item:IListItem) => {
    console.log(item.order_id)
    setCurrentViewingItem(item)
    setCurrentEditingOrder(item)
    setArchivedOrderDetailModalVisible(true)
  }

  const onClickBackGround = () => {
    setArchivedOrderDetailModalVisible(false)
    setOrderDetailModalVisible(false)
  }

  const addTestOrder = () => {
    var precision = 100; // 2 decimals
    var randomnum = Math.floor(Math.random() * (10 * precision - 1 * precision) + 1 * precision) / (1*precision);
    console.log(randomnum)
    createQROrderItem(
      Date.parse(new Date()).toString(),
      itemList.length,//?
      "testOrder"+itemList.length,
      "MNEM",
      "0xc4934D5347887dc90775a815DC102ea8f5101038",
      "0x1",
      randomnum.toString(),
      new Date(),
      //walletAddr,
      "0x9B40d31fdc6Ef74D999AFDdeF151f8E864391cfF",
      "0xae9b0835a25d35d3dcf614666ea40437964c41cd1a31645a7a42b6673ecbdefc"
    )
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
    loadOrderItem2List()
    //if (realm && !realm.isClosed) {
      //realm.close();
    //}
  }

  const createArchivedQROrderItem = (
    id: string,
    name: string,
    crypto_name_short: string,
    crypto_contract_addr: string,
    crypto_chain_id: string,
    crypto_price_ezread: string,
    dateCreate: Date,
    fromAddr: string,
    txHash: string,
  ) => {
    let realm = new Realm({schema: [ArchivedQROrderSchema]});
    //write to local Database
    realm.write(() => {
      let item = realm.create('ArchivedQROrderItem', {
        id: id,
        name: name,
        crypto_name_short: crypto_name_short,
        crypto_contract_addr: crypto_contract_addr,
        crypto_chain_id: crypto_chain_id,
        crypto_price_ezread: crypto_price_ezread, // short form without 0s
        dateCreate: dateCreate,
        fromAddr: fromAddr,
        txHash: txHash
      });
    });
    if (realm && !realm.isClosed) {
      realm.close();
      console.log("Realm Close")
    }
  }

  const loadOrderItem2List = async() => {
    
    //let realm = new Realm({schema: [QROrderSchema]});
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
      console.log("Realm Close After load QR orders")
    })

    //if (realm && !realm.isClosed) {
      //realm.close();
    //}
  }

  const loadArchivedOrderItem2List = async() => {
    
    //let realm = new Realm({schema: [ArchivedQROrderSchema]});
    let data = [{name: 'FirstItemname', description: 'DescripTioN'}]
    data=[]

    Realm.open({schema: [ArchivedQROrderSchema]})
    .then(realm => {
      // ... use the realm instance to read and modify data
      let realmItemList = realm.objects('ArchivedQROrderItem')
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

      setArchivedItemItemList(data)
      realm.close();
      console.log("Realm Close")
    })
    /*
    if (realm && !realm.isClosed) {
      realm.close();
    }
    */
  }

  /*
  const loadOrderItem2ListFromAWS = async() => {
    
    const jsonStr = await scanQROrders(walletAddr)
    //const receivedQRorderListJSON = JSON.parse(jsonStr)
    console.log(jsonStr)
    let receivedQRorderList = []
    
    order_id: '',
    onScreenIdx: 0,
    toAddr: null,
    chainId: null,
    cryptoNameShort: null,
    cryptoContractAddr: null,
    cryptoPriceEzread: null,
    createDate: null,
    fromAddr: null,
    
    
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
  */

  const deleteQROrderItem = (item) => {
    let realm = new Realm({schema: [QROrderSchema]});
    //let item = realm.create('OfflineQRItem', {id: 1});
    //realm.delete(item)
    console.log("Ready to delete Order:")
    console.log(item)
    realm.write(() => {
      const taskToDelete = realm.objectForPrimaryKey('QROrderItem', item.id);
      if (taskToDelete) {
        realm.delete(taskToDelete);
      }
    });
    if (realm && !realm.isClosed) {
      realm.close();
      console.log("Realm Close After delete")
    }
    setCurrentEditingOrder(itemNull)
    setDeleteOrderConfirmModalVisible(false)
    setOrderDetailModalVisible(false)
    loadOrderItem2List()
  }

  const deleteArchivedQROrderItem = (item) => {
    let realm = new Realm({schema: [ArchivedQROrderSchema]});
    //let item = realm.create('OfflineQRItem', {id: 1});
    //realm.delete(item)
    console.log(item)
    realm.write(() => {
      const taskToDelete = realm.objectForPrimaryKey('ArchivedQROrderItem', item.id);
      if (taskToDelete) {
        realm.delete(taskToDelete);
      }
    });
    if (realm && !realm.isClosed) {
      realm.close();
      console.log("Realm Close")
    }
    setCurrentEditingOrder(itemNull)
    setDeleteArchivedOrderConfirmModalVisible(false)
    setArchivedOrderDetailModalVisible(false)
    loadArchivedOrderItem2List()
  }

  const saveQROrder = (item) => {
    createArchivedQROrderItem(
      item.id,
      item.name,
      item.crypto_name_short,
      item.crypto_contract_addr,
      item.crypto_chain_id,
      item.crypto_price_ezread,
      item.dateCreate,
      item.fromAddr,
      item.txHash,
    )
    deleteQROrderItem(item)
    loadOrderItem2List()
    setTimeout(function (){loadArchivedOrderItem2List()}, 1000)
  }

  const onConfirmRefund = () => {
  }
  

  //--------------------------------------------
  /*
  const eth_estimationGas = async (to, value) => {
    console.log('to', to);
    console.log('value', value);
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
  */

  return (
    
    <View style={styles.container}>
      <Modal
        visible={orderDetailModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setOrderDetailModalVisible(false)}
      >
        <QROrderViewCard 
          item={currentEditingOrder} 
          deleteOrderHandler={deleteQROrderItem}
          langPack={langPack}
        />
      </Modal>
      <Modal
        visible={archivedOrderDetailModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setArchivedOrderDetailModalVisible(false)}
      >
        <QROrderViewCard 
          item={currentEditingOrder} 
          deleteOrderHandler={deleteArchivedQROrderItem}
          langPack={langPack}
        />
      </Modal>
      <Modal
        visible={deleteOrderConfirmModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setDeleteOrderConfirmModalVisible(false)}
      >
        <Text category='h5'>
          {langPack.receivedQROrderListLayout_askDelete_ReceivedOrder}
        </Text>
        <Button
          onPress={ () => deleteQROrderItem(currentEditingOrder)}>
          {langPack.receivedQROrderListLayout_deleteButton_Received}
        </Button>
      </Modal>

      <Modal
        visible={deleteArchivedOrderConfirmModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setDeleteArchivedOrderConfirmModalVisible(false)}
      >
        <Text category='h5'>
          {langPack.receivedQROrderListLayout_askDelete_ArchivedOrder}
        </Text>
        <Button
          onPress={ () => deleteArchivedQROrderItem(currentEditingOrder)}>
          {langPack.receivedQROrderListLayout_deleteButton_Archived}
        </Button>
      </Modal>
      <Layout>
        <Layout
          style={styles.rowContainer}
          level='1'
        >
          <Text category='h5' style={styles.title}>
            {langPack.receivedQROrderListLayout_title_receivedOrders}
          </Text>
          <Button
            style={styles.addItemButton}
            appearance='ghost'
            accessoryLeft={renderAddItemIcon}
            onPress={ () => addTestOrder()}
          />
          
        </Layout>
        <List
          style={styles.container}
          data={itemList}
          renderItem={renderItem}
        />

        <Layout
          style={styles.rowContainer}
          level='1'
        >
          <Text category='h5' style={styles.title}>
            {langPack.receivedQROrderListLayout_title_archivedOrders}
          </Text>
          
        </Layout>

        <List
          style={styles.container}
          data={archivedItemList}
          renderItem={renderArchivedItem}
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
  accessoriesButton: {
    margin: 1,
  },
  title: {
    margin: 10,
  }
});