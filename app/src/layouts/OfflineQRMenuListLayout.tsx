import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Button, Card, Icon, IconElement, List, ListItem, Layout, Modal, Text  } from '@ui-kitten/components';
import { StyleSheet, Alert, View } from 'react-native';
//import { CameraRoll , ToastAndroid } from "react-native"
//import RNFS from "react-native-fs"
import * as FileSystem from 'expo-file-system';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Realm, useApp, useAuth, useQuery, useRealm, useUser} from '@realm/react';
import { OfflineItemEditCard } from '../components/OfflineItemEditCard'
import {
  QrCodeSvg,
  plainRenderer,
} from 'react-native-qr-svg';
import ViewShot, {captureRef} from "react-native-view-shot";
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useIsFocused } from '@react-navigation/native';


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

export const OfflineQRMenuListLayout = ({langPack, isFocused} ): JSX.Element => {
  // ---------------State variables--------------- 
  const [currentLang, setCurrentLang] = useState("en");
  const [itemList, setItemList] = useState<IListItem[] | []>([]);;
  const [itemDetailModalVisible, setItemDetailModalVisible] = useState(false);
  const [deleteItemConfirmModalVisible, setDeleteItemConfirmModalVisible] = useState(false);
  const [qRCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qRCodeSavedModalVisible, setQRCodeSavedModalVisible] = useState(false);

  const [currentEditingItem, setCurrentEditingItem] = useState(itemNull);
  const [currentQRItemJSON, setCurrentQRItemJSON] = useState("");
  const [qRItemMode, setQRItemMode] = useState("create");

  const qrRef = useRef();
  //const isFocused = useIsFocused();

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
    //const realm = new Realm({ schema: [OfflineQRItemSchema] });
    console.log("useEffect Menu LIst")
    setTimeout(function (){loadOfflineQRItem2List()}, 2000)

    if (isFocused) {
      console.log('OfflineQRMenuListLayout is focused');
      // Perform actions when the screen is focused
      setTimeout(function (){loadOfflineQRItem2List()}, 2000)
    } else {
      console.log('OfflineQRMenuListLayout is not focused');
      // Perform actions when the screen is unfocused
    }
    
    // Cleanup function to close Realm
    /*
    return () => {
      if (realm && !realm.isClosed) {
        realm.close();
      }
    };
    */
  }, [isFocused])

  //
  const renderItemAccessory = (item): React.ReactElement => (
    <>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => onClickShowQRCodebutton(item)
      }>
      {langPack.offlineQRMenuListLayout_itemlist_showQR}
    </Button>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => testOrder(item)
      }>
      {langPack.offlineQRMenuListLayout_itemlist_testorder}
    </Button>
    <Button 
      size='tiny' 
      style={styles.accessoriesButton}
      disabled={false} 
      onPress={ () => {
        setCurrentEditingItem(item)
        setDeleteItemConfirmModalVisible(true)
      }}>
      {langPack.offlineQRMenuListLayout_itemlist_delete}
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
      key={item.id}
      title={`${item.name} `}
      description={ `${item.description.length > 20 ? (item.description.substring(0,20)+"..") : item.description } `}
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
      description: langPack.offlineQRMenuListLayout_itemEntry_desc,
      crypto_name_short: langPack.offlineQRMenuListLayout_itemEntry_selectToken,
      crypto_contract_addr: null,
      crypto_chain_id: null,
      crypto_price_ezread: null,
      dateCreate: new Date(),
      dateUpdate: new Date(),
    }
    setCurrentEditingItem(item)
    setItemDetailModalVisible(true)
    setQRItemMode("create")
  }

  const onClickItemOntheList = (item:IListItem) => {
    console.log(item.id)
    setCurrentEditingItem(item)
    setItemDetailModalVisible(true)
    setQRItemMode("edit")
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
    setCurrentEditingItem(item)
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
    //let realm = new Realm({schema: [OfflineQRItemSchema]});
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
      if (!realm.isClosed) {
        realm.close();
        console.log("Realm instance has been closed.");
    }
    })
    
    //realm.close();
    console.log("Realm Close at QR Menu")
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
    
    console.log("Item to be created/update")
    console.log(id)
    if (qRItemMode==="create") {
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
    } else {
      const objectToUpdate = realm.objectForPrimaryKey("OfflineQRItem", id);
      realm.write(() => {
        objectToUpdate.onScreenIdx= onScreenIdx
        objectToUpdate.name=  name
        objectToUpdate.description= description
        objectToUpdate.crypto_name_short= crypto_name_short
        objectToUpdate.crypto_contract_addr= crypto_contract_addr
        objectToUpdate.crypto_chain_id= crypto_chain_id
        objectToUpdate.crypto_price_ezread= crypto_price_ezread 
        objectToUpdate.dateCreate= dateCreate
        objectToUpdate.dateUpdate= dateUpdate
      });
    }
    
    //write to local Database
    
    loadOfflineQRItem2List()
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
    setCurrentEditingItem(itemNull)
    setDeleteItemConfirmModalVisible(false)
    loadOfflineQRItem2List()
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

  
  const saveQrToDisk = async (qrRef: React.RefObject<View>, filename:string) => {
    console.log(qrRef)
    
    try {
      if (!qrRef.current) {
        throw new Error('QR code reference is not available.');
      }
  
      // Capture the QR code view as an image
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1.0,
      });
      
      
      // Define file path
      //const filePath = `${RNFS.CachesDirectoryPath}/${filename}.png`;
  
      // Move the captured image to the file path
      //await RNFS.moveFile(uri, filePath);
      

      // Define file path
      const filePath = `${FileSystem.cacheDirectory}${filename}.png`;

      await FileSystem.moveAsync({
        from: uri,
        to: filePath,
      });

      // Save to gallery
      await CameraRoll.save(filePath, { type: 'photo' });
  
      console.log('QR code saved to gallery!');
      setQRCodeModalVisible(false)
      setQRCodeSavedModalVisible(true)
    } catch (error) {
      console.error('Error saving QR code:', error);
      setQRCodeModalVisible(false)
      setQRCodeSavedModalVisible(true)
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
          saveItemHandler={onClickSavebutton}
          langPack={langPack}
        />
      </Modal>

      <Modal
        visible={deleteItemConfirmModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setDeleteItemConfirmModalVisible(false)}
      >
        <Text>
          {langPack.offlineQRMenuListLayout_askConfirmDelete}
        </Text>
        <Text>
          {langPack.offlineQRMenuListLayout_askConfirmDelete2}
        </Text>
        <Text>
          
        </Text>
        <Button
        onPress={ () => deleteOfflineQRItem(currentEditingItem)}>
          {langPack.offlineQRMenuListLayout_delete}
        </Button>
      </Modal>

      <Modal
        visible={qRCodeModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setQRCodeModalVisible(false)}
      >
        <View style={styles.qrroot}>
          <ViewShot ref={qrRef} options={{ fileName: currentEditingItem.name, format: "png", quality: 1.0 }}>
            <View style={styles.qrcontent} >
              
              <QrCodeSvg
                style={styles.qr}
                gradientColors={['#0800ff', '#ff0000']}
                value={currentQRItemJSON}
                frameSize={SIZE}
              />
              <Text category='h5'>
                {currentEditingItem.name}
              </Text> 
              <Text>{langPack.offlineQRMenuListLayout_item_crypto}: {currentEditingItem.crypto_name_short}</Text>
              <Text>{langPack.offlineQRMenuListLayout_item_price}: {currentEditingItem.crypto_price_ezread}</Text>
              <Text>{langPack.offlineQRMenuListLayout_item_desc}: {currentEditingItem.description}</Text>
              
              <Text>  </Text>
              
            </View>
          </ViewShot>
          <Button 
            size='large' 
            disabled={false} 
            //onPress={() => setTimeout(() => saveQrToDisk(qrRef, currentEditingItem.name), 300)}
            onPress={() => null}
            >
            {langPack.offlineQRMenuListLayout_button_exportQR}
          </Button>
        </View> 


      </Modal>

      <Modal
        visible={qRCodeSavedModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setQRCodeSavedModalVisible(false)}
      >
        <Text>{langPack.offlineQRMenuListLayout_exportQR_saved}</Text>
      </Modal>

      <Layout>
        <Layout
          style={styles.rowContainer}
          level='1'
        >
          <Text category='h5' style={styles.title}>
            {langPack.offlineQRMenuListLayout_title}
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
  accessoriesButton: {
    margin: 1,
  },
  title: {
    margin: 10,
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