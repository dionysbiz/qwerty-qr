import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, Layout, Input } from '@ui-kitten/components';
import PropTypes from 'prop-types';

export type Props = {
  item: any,
  createItemHandler: any ,
  closeHandler: any ,
};

export const OfflineItemEditCard = ({ item, createItemHandler, saveItemHandler }): React.ReactElement => {
  // ---------------State variables--------------- 
  const [currentLang, setCurrentLang] = useState("en");
  //const [itemDetailModalVisible, setItemDetailModalVisible] = useState(false);

  const [itemId, setItemId] = useState(item.id);
  const [itemName, setItemName] = useState(item.name);
  const [itemDescription, setItemDescription] = useState(item.description);
  const [itemCryptoShort, setItemCryptoShort] = useState(item.crypto_name_short);
  const [itemPriceCryptoEzread, setItemPriceCryptoEzread] = useState(item.price_crypto_ezread);
  const [itemDateCreate, setItemDateCreate] = useState(item.dateCreate);
  const [itemDateUpdate, setItemDateUpdate] = useState(item.dateUpdate);
  

  // ---------------Visual Items--------------- 
  //const isDarkMode = useColorScheme() === 'dark';

  // ---------------navigate function--------------- 

  // ---------------onPress Handler---------------

  const hashCode = function(str:String) {
    var hash = 0,
      i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  useEffect(() => {
    
    //loadOfflineQRItem2List()
  })

  /*
  let item = {
    id: number,
    onScreenIdx: number,
    name: string,
    description: string,
    cryptoshort: string,
    price_crypto_ezread: string,
    dateCreate: Date,
    dateUpdate: Date,
  }
    <Text>Create Date: {item.dateCreate}</Text>
    <Text>Last Update: {item.dateUpdate}</Text>  
    <Text>Create Date: {itemDateCreate}</Text>
      <Text>Last Update: {itemDateUpdate}</Text>  
  */
  return (
    
    <Card style={styles.container} disabled={true}>
      <Input
        placeholder='Item Name'
        value={itemName}
        onChangeText={nextValue => setItemName(nextValue)}
      />
      <Input style={styles.inputbox}
         textStyle={styles.inputTextStyle}
        placeholder='Description'
        value={itemDescription}
        multiline={true}
        onChangeText={nextValue => setItemDescription(nextValue)}
      />
      <Input
        placeholder='Crypto Currency'
        value={itemCryptoShort}
        onChangeText={nextValue => setItemCryptoShort(nextValue)}
      />
      <Input
        placeholder='Price'
        value={itemPriceCryptoEzread}
        onChangeText={nextValue => setItemPriceCryptoEzread(nextValue)}
      />

      {itemId !== '' &&
      <>
        <Text>Date Created: {item.dateCreate.toISOString()} </Text>
        <Text>Last Updated: {item.dateUpdate.toISOString()} </Text>
      </>
      }

      
      
      <Button onPress={() => {
        let newId= ''
        let newCreateDate:Date=new Date()
        let newUpdateDate:Date=new Date()

        if (itemId === '') {
          newId=String(hashCode(itemName))
          setItemId(newId)
          newCreateDate=new Date()
          newUpdateDate=new Date()
        } else {
          newId=itemId
          setItemId(newId)
          newCreateDate=itemDateCreate
          newUpdateDate=new Date()
        }

        saveItemHandler(
          {
            "id": newId,
            "name": itemName,
            "description": itemDescription,
            "cryptoNameShort": itemCryptoShort,
            "price_crypto_ezread": itemPriceCryptoEzread,
            "dateCreate": newCreateDate
          }
        )
      }}>
        Save
      </Button>
    </Card>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '800' , 
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 2
  },
  button: {
    margin: 2,
  },
  inputbox: {
    marginVertical: 2,
  },
  inputTextStyle: {
    minHeight: 64,
  },
});