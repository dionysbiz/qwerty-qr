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


interface IListItem {
  id: string,
  name: string;
  description: string;
  crypto_name_short: string,
  price_crypto_ezread: string, // short form without 0s
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
    price_crypto_ezread: 'string', // short form without 0s
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
  price_crypto_ezread: null,
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
      crypto_name_short: 'null',
      price_crypto_ezread: '0',
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
      item.cryptoNameShort,
      item.price_crypto_ezread,
      item.dateCreate,
      new Date(),
    )
    setItemDetailModalVisible(false)
  }

  const onClickShowQRCodebutton = (item) => {
    item.scanAction="transfer"
    item.toWalletAddr="currentwallet Address"
    item.erc20ContractAddr="contract address"
    item.chain="chainId"
    let content = JSON.stringify(item)
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
          name: String(p.name), 
          description: String(p.description),
          crypto_name_short: String((p.crypto_name_short)),
          price_crypto_ezread: String((p.price_crypto_ezread)),
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
    cryptoNameShort: string,
    price_crypto_ezread: string,
    dateCreate: Date,
    dateUpdate: Date,
  ) => {
    let realm = new Realm({schema: [OfflineQRItemSchema]});
    realm.write(() => {
      let item = realm.create('OfflineQRItem', {
        id: id,
        onScreenIdx: onScreenIdx,
        name:  name,
        description: description,
        crypto_name_short: cryptoNameShort,
        price_crypto_ezread: price_crypto_ezread, // short form without 0s
        dateCreate: dateCreate,
        dateUpdate: dateUpdate,
      });
    });
  }
  
  const deleteOfflineQRItem = (
    id: number,
    onScreenIdx: number,
    name: string,
    description: string,
    crypto_name_short: string,
    price_crypto_ezread: string,
    dateCreate: Date,
    dateUpdate: Date,
  ) => {
    let realm = new Realm({schema: [OfflineQRItemSchema]});
    let item = realm.create('OfflineQRItem', {id: 1});
    realm.delete(item)
  }
  
  const deleteAllOfflineQRItem = (
  ) => {
    let realm = new Realm({schema: [OfflineQRItemSchema]});
    let allItem = realm.objects('OfflineQRItem');
    realm.delete(allItem)
  }

  useEffect(() => {
    
    loadOfflineQRItem2List()
  })

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