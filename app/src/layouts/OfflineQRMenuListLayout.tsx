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

interface IListItem {
  id: string,
  name: string;
  description: string;
  crypto_name_short: string,
  crypto_contract_addr: string,
  crypto_chain_id: string,
  crypto_price_ezread: string, // short form without 0x
  dateCreate?: Date,
  dateUpdate?: Date,
}
/*
let data = new Array(16).fill({
  title: 'Title for Item',
  description: 'Description for Item',
});
*/

const OfflineQRItemSchema = {
  name: 'OfflineQRItem',
  primaryKey: 'id',
  properties: {
    id: 'string',
    onScreenIdx: 'int',
    name:  'string',
    description: 'string?',
    crypto_name_short: 'string',
    crypto_contract_addr: 'string',
    crypto_chain_id: 'string',
    crypto_price_ezread: 'string', // short form without 0s
    dateCreate: 'date',
    dateUpdate: 'date',
  }
};

const itemNull:IListItem = {
  id: '',
  onScreenIdx: 0,
  name: null,
  description: null,
  crypto_name_short: null,
  crypto_contract_addr: null,
  crypto_chain_id: null,
  crypto_price_ezread: null,
  dateCreate: null,
  dateUpdate: null,
}

export const OfflineQRMenuListLayout = (): JSX.Element => {
  // ---------------State variables--------------- 
  const [currentLang, setCurrentLang] = useState("en");
  const [itemList, setItemList] = useState<IListItem[] | []>([]);;
  const [itemDetailModalVisible, setItemDetailModalVisible] = useState(false);
  const [qRCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState(itemNull);
  const [currentQRItemJSON, setCurrentQRItemJSON] = useState("");



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

  useEffect(() => {
    const realm = new Realm({ schema: [OfflineQRItemSchema] });
    loadOfflineQRItem2List()
    // Cleanup function to close Realm
    return () => {
      if (realm && !realm.isClosed) {
        realm.close();
      }
    };
  })

  //
  const renderItemAccessory = (item): React.ReactElement => (
    <>
    <Button 
      size='tiny' 
      disabled={false} 
      onPress={ () => onClickShowQRCodebutton(item)
      }>
      QR Code
    </Button>
    <Button 
      size='tiny' 
      disabled={false} 
      onPress={ () => testOrder(item)
      }>
      TEST Order
    </Button>
    <Button 
      size='tiny' 
      disabled={false} 
      onPress={ () => deleteOfflineQRItem(item)
      }>
      Delete
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
      title={`${item.name} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory(item)}
      onPress={() => onClickItemOntheList(item)}
    />
  );

  // ---------------onPress Handler---------------

  const onClickAddItemButton = () => {
    
    let item:IListItem = {
      //onScreenIdx: itemList.length,
      id: "",
      name: "",
      description: "Description",
      crypto_name_short: "Select Token",
      crypto_contract_addr: null,
      crypto_chain_id: null,
      crypto_price_ezread: '0',
      dateCreate: new Date(),
      dateUpdate: new Date(),
    }
    setCurrentEditingItem(item)
    setItemDetailModalVisible(true)
  }

  const onClickItemOntheList = (item:IListItem) => {
    console.log(item.id)
    setCurrentEditingItem(item)
    setItemDetailModalVisible(true)
  }

  const onClickSavebutton = (item) => {
    
    createUpdateOfflineQRItem(
      item.id,
      itemList.length,
      item.name,
      item.description,
      item.crypto_name_short,
      item.crypto_contract_addr,
      chainId,
      item.crypto_price_ezread,
      item.dateCreate,
      new Date(),
    )
    console.log("------Item to be insert to local DB------")
    console.log(item.id)
    console.log(itemList.length)
    console.log(item.name)
    console.log(item.description)
    console.log(item.crypto_name_short)
    console.log(item.crypto_contract_addr)
    console.log(chainId)
    console.log(item.crypto_price_ezread)
    console.log(item.dateCreate)
    
    setItemDetailModalVisible(false)
  }

  const onClickShowQRCodebutton = (item) => {
    let extractedItem = {
      scanAction: "transfer",
      name: item.name,
      crypto_name_short: item.crypto_name_short,
      crypto_contract_addr: item.crypto_contract_addr,
      crypto_chain_id: item.crypto_chain_id,
      crypto_price_ezread: item.crypto_price_ezread,
      toWalletAddr: account
    }
    
    
    //item.erc20ContractAddr="contract address"
    let content = JSON.stringify(extractedItem)
    // TO deserialize: JSON.parse(item)
    setCurrentQRItemJSON(content)
    setQRCodeModalVisible(true)
  }

  const onClickBackGround = () => {
    
    setItemDetailModalVisible(false)
  }

  const loadOfflineQRItem2List = () => {
    let realm = new Realm({schema: [OfflineQRItemSchema]});
    let data = [{name: 'FirstItemname', description: 'DescripTioN'}]
    data=[]

    Realm.open({schema: [OfflineQRItemSchema]})
    .then(realm => {
      // ... use the realm instance to read and modify data
      let realmItemList = realm.objects('OfflineQRItem')

      for (let p of realmItemList) {
        let item:IListItem = {
          id: String(p.id), 
          name: String(p.name), 
          description: String(p.description),
          crypto_name_short: String((p.crypto_name_short)),
          crypto_contract_addr: String((p.crypto_contract_addr)),
          crypto_chain_id: String((p.crypto_chain_id)),
          crypto_price_ezread: String((p.crypto_price_ezread)),
          dateCreate: new Date(p.dateCreate),
          dateUpdate: new Date(p.dateUpdate),
        }
        data.push(item)
      }

      setItemList(data)
      realm.close();
    })
    
    //realm.close();
  }
  
  const createUpdateOfflineQRItem = (
    id: string,
    onScreenIdx: number,
    name: string,
    description: string,
    crypto_name_short: string,
    crypto_contract_addr: string,
    crypto_chain_id: string,
    crypto_price_ezread: string,
    dateCreate: Date,
    dateUpdate: Date,
  ) => {
    let realm = new Realm({schema: [OfflineQRItemSchema]});
    //write to local Database
    realm.write(() => {
      let item = realm.create('OfflineQRItem', {
        id: id,
        onScreenIdx: onScreenIdx,
        name:  name,
        description: description,
        crypto_name_short: crypto_name_short,
        crypto_contract_addr: crypto_contract_addr,
        crypto_chain_id: crypto_chain_id,
        crypto_price_ezread: crypto_price_ezread, // short form without 0s
        dateCreate: dateCreate,
        dateUpdate: dateUpdate,
      });
    });
  }
  
  const deleteOfflineQRItem = (item) => {
    let realm = new Realm({schema: [OfflineQRItemSchema]});
    //let item = realm.create('OfflineQRItem', {id: 1});
    //realm.delete(item)
    console.log(item)
    realm.write(() => {
      const taskToDelete = realm.objectForPrimaryKey('OfflineQRItem', item.id);
      if (taskToDelete) {
        realm.delete(taskToDelete);
      }
    });
  }
  
  const deleteAllOfflineQRItem = (
  ) => {
    let realm = new Realm({schema: [OfflineQRItemSchema]});
    let allItem = realm.objects('OfflineQRItem');
    realm.delete(allItem)
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

  const testOrder = async (qrData:any) => {
    /* QR item content
        scanAction: "transfer",
        name: item.name,
        crypto_name_short: item.crypto_name_short,
        crypto_contract_addr: item.crypto_contract_addr,
        crypto_chain_id: item.crypto_chain_id,
        crypto_price_ezread: item.crypto_price_ezread,
        toWalletAddr: account

        fromWallet<----add
    */
    try {
      console.log(qrData.id)
      console.log(qrData.name)
      console.log(qrData.crypto_name_short)
      console.log(qrData.crypto_contract_addr)
      //console.log(item.chainId)
      console.log(qrData.crypto_price_ezread)
      //console.log(item.dateCreate)
    
    } catch (e) {
      console.log('ERROR', e);
    }
    
  };

  //kubectl port-forward hardhatnetwork-dev-ddddc4fff-6bpfz -n hardhatnetwork-dev 8545:8545
  const sendTransaction = async (qr:any) => {
    try {
      qr.toWalletAddr=account
      console.log('qr', qr);
        const valueWei = Web3.utils.toWei(qr.crypto_price_ezread, 'ether')
        const valueGwei = Web3.utils.fromWei(valueWei, 'gwei')
        const valueGweiHex = '0x'+Number(valueGwei).toString(16)
        const gas = await eth_estimationGas(qr.toWalletAddr, '0x1')
        const gasPrice = await eth_gasPrice()
        console.log('value', valueWei);
        console.log('valueHex', valueGweiHex);
        console.log('gas', gas);
        console.log('gasPrice', gasPrice);

        
        const result = await ethereum?.request({
          method: 'eth_sendTransaction',
          params: [
            {
              to: '0x9B40d31fdc6Ef74D999AFDdeF151f8E864391cfF',
              from: account,
              //gas: gas,
              //data: '0x',
              value: valueWei,
              //gasPrice: gasPrice
            }
          ]
        });
        console.log('eth_sendTransaction', result);
        
        //setResponse(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const sendERC20Transaction = async (qr:any) => {
    try {
      qr.toWalletAddr=account
      console.log('qr', qr);
        const valueWei = Web3.utils.toWei(qr.crypto_price_ezread, 'ether')
        const valueGwei = Web3.utils.fromWei(valueWei, 'gwei')
        const valueGweiHex = '0x'+Number(valueGwei).toString(16)
        const gas = await eth_estimationGas(qr.toWalletAddr, '0x1')
        const gasPrice = await eth_gasPrice()
        console.log('value', valueWei);
        console.log('valueHex', valueGweiHex);
        console.log('gas', gas);
        console.log('gasPrice', gasPrice);

        const contract = new Web3.
        eth.Contract(abi, qr.contractAddress);

        
        const result = await ethereum?.request({
          method: 'eth_sendTransaction',
          params: [
            {
              to: '0x9B40d31fdc6Ef74D999AFDdeF151f8E864391cfF',
              from: account,
              gas: gas,
              data: '0x',
              value: valueWei,
              gasPrice: gasPrice
            }
          ]
        });
        console.log('eth_sendTransaction', result);
        
        //setResponse(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  

  const SIZE = 170;

  return (
    <View style={styles.container}>

      <Modal
        visible={itemDetailModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setItemDetailModalVisible(false)}
      >
        <OfflineItemEditCard 
          item={currentEditingItem} 
          createItemHandler={createUpdateOfflineQRItem}
          saveItemHandler={onClickSavebutton}
        />
      </Modal>

      <Modal
        visible={qRCodeModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setQRCodeModalVisible(false)}
      >
        <View style={styles.qrroot}>
          <View style={styles.qrcontent}>
            <QrCodeSvg
              style={styles.qr}
              gradientColors={['#0800ff', '#ff0000']}
              value={currentQRItemJSON}
              frameSize={SIZE}
            />
            <Text category='h5'>
              Message
            </Text> 
            <Button 
              size='large' 
              disabled={false} 
              >
              PRINT
            </Button>
          </View>
        </View> 


      </Modal>

      <Layout>
        <Layout
          style={styles.rowContainer}
          level='1'
        >
          <Text category='h5'>
            QR Menu Items
          </Text>
          <Button
            style={styles.addItemButton}
            appearance='ghost'
            accessoryLeft={renderAddItemIcon}
            onPress={ () => onClickAddItemButton()}
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