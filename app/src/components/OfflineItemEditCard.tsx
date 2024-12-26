import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, IndexPath, Card, Text, Layout, Select, SelectItem, MenuItem, Input, OverflowMenu } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { useSDK } from '@metamask/sdk-react';

let TOKENLIST = []

const CHAINTOKENLIST = [
  {
    //Local Hardhat Test Chain
    chainId: '0x7a69',
    crypto:
    [
      {
        id: 0,
        name_short: 'MNEM',
        contract_addr: '0xc4934D5347887dc90775a815DC102ea8f5101038'
      },
    
    ]
  },
  {
    //Mainnet
    chainId: '0x1',
    crypto:
    [
      {
        id: 0,
        name_short: 'USDT',
        contract_addr: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
      },
      {
        id: 1,
        name_short: 'MNEM',
        contract_addr: '0xc4934D5347887dc90775a815DC102ea8f5101038'
      },
    
    ]
  },
  {
    //Arbitrum
    chainId: '0xa4b1',
    crypto:
    [
      {
        id: 0,
        name_short: 'USDT',
        contract_addr: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
      },    
    ]
  },
  {
    //OP Mainnet
    chainId: '0xa',
    crypto:
    [
      {
        id: 0,
        name_short: 'USDT',
        contract_addr: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'
      },
    ]
  },
  
]

export type Props = {
  item: any,
  closeHandler: any ,
};

export const OfflineItemEditCard = ({ item, saveItemHandler }): React.ReactElement => {
  // ---------------State variables--------------- 
  const [currentLang, setCurrentLang] = useState("en");
  //const [itemDetailModalVisible, setItemDetailModalVisible] = useState(false);
  const [CHAINTOKENLISTVisible, setCHAINTOKENLISTVisible] = React.useState(false);
  const [tokenList, setTokenList] = React.useState([]);
  const [selectedTokenIndex, setSelectedTokenIndex] = React.useState(new IndexPath(0));

  const [itemId, setItemId] = useState(item.id);
  const [itemName, setItemName] = useState(item.name);
  const [itemDescription, setItemDescription] = useState(item.description);
  const [itemCryptoShort, setItemCryptoShort] = useState(item.crypto_name_short);
  const [itemCryptoContractAddr, setItemCryptoContractAddr] = useState(item.crypto_contract_addr);
  const [itemCryptoChainId, setItemCryptoChainId] = useState(item.crypto_chain_id);
  const [itemPriceCryptoEzread, setItemPriceCryptoEzread] = useState(item.crypto_price_ezread);
  const [itemDateCreate, setItemDateCreate] = useState(item.dateCreate);
  const [itemDateUpdate, setItemDateUpdate] = useState(item.dateUpdate);

  const [tokenShortDisplayValue, setTokenShortDisplayValue] = useState(item.crypto_name_short);
  const [saveBtnDisable, setSaveBtnDisable] = useState(true);
  const [saveBtnText, setSaveBtnText] = useState("Create");

  //const [placementIndex, setPlacementIndex] = React.useState(new IndexPath(1, 0));
  //const placement = placements[placementIndex.row];
  let displayValue = TOKENLIST[selectedTokenIndex.row];

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
  

  // ---------------Visual Items--------------- 
  //const isDarkMode = useColorScheme() === 'dark';
  const renderMenuAction = (): React.ReactElement => (
    <Select
      placeholder='Select Token'
      //value={placement}
      //selectedIndex={placementIndex}
      //onSelect={onPlacementSelect}
    >
      
    </Select>
  );

  // ---------------navigate function--------------- 

  // ---------------onPress Handler---------------
  const toggleCHAINTOKENLIST = (): void => {
    setCHAINTOKENLISTVisible(!CHAINTOKENLISTVisible);
  };

  const handleTokenSelect = (index) => {
    //console.log("handleTokenSelect")
    console.log("index",index)
    //console.log("chainArr[index.row]",chainArr[index.row])
    console.log(TOKENLIST)
    const token= TOKENLIST.crypto[index.row]
    console.log(token)
    setSelectedTokenIndex(index)
    setItemCryptoContractAddr(token.contract_addr)
    setItemCryptoChainId(chainId)
    setItemCryptoShort(token.name_short)
    setTokenShortDisplayValue(token.name_short)
    //toggleCHAINTOKENLIST()
  };

  const checkAllDataAvailable = () => {
    let priceNum = parseInt(itemPriceCryptoEzread)
    if (
      
      (itemName && itemName!=='') &&
      (itemCryptoContractAddr && itemCryptoContractAddr!=='') &&
      (itemPriceCryptoEzread && itemPriceCryptoEzread!=='') &&
      (priceNum >0)
    ) {
      setSaveBtnDisable(false)
    }

      


  };

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
    if (itemId===""){
      setSaveBtnText("Create")
    } else {
      setSaveBtnText("Update")
    }
    
    /*
    if (itemCryptoShort==='Select Token') {
      setItemCryptoShort(null)
    }
    */
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
    <Layout style={styles.modalcontainer}>
    <Card style={styles.container} disabled={true}>
      <Input style={styles.inputbox}
        placeholder='Item Name'
        value={itemName}
        onChangeText={nextValue => {
          setItemName(nextValue)
          checkAllDataAvailable()
        }}
      />
      <Input style={styles.inputbox}
         textStyle={styles.inputTextStyle}
        placeholder='Description'
        value={itemDescription}
        multiline={true}
        onChangeText={nextValue => {
          setItemDescription(nextValue)
          checkAllDataAvailable()
        }}
      />
      <Select style={styles.inputbox}
        //placeholder='Select Token'
        //visible={CHAINTOKENLISTVisible}
        //onBackdropPress={toggleCHAINTOKENLIST}
        value={tokenShortDisplayValue}
        selectedIndex={selectedTokenIndex}
        onSelect={nextValue => {
          handleTokenSelect(nextValue)
          checkAllDataAvailable()
        }}
      >
        {CHAINTOKENLIST.map((option, listIndex) => {
          if (option.chainId === chainId) {
            //setTokenList(option)
            TOKENLIST = option
          }
          return (

            option.chainId === chainId ? (
              
              <>
              {option.crypto.map((it, index) => (
                <SelectItem 
                key={it.id} 
                title={it.name_short}   
                //selected={handleTokenSelect(it)}
                
                />
              ))}
              </>
            
            ) : <></>
          )
      })}
      </Select>
      <Input style={styles.inputbox}
        placeholder='Price'
        value={itemPriceCryptoEzread}
        onChangeText={nextValue => {
          setItemPriceCryptoEzread(nextValue.replace(/[^0-9]/g, ''))
          checkAllDataAvailable()
        }}
        keyboardType='numeric'
      />

      {itemId !== '' &&
      <>
        <Text>Date Created: {item.dateCreate.toISOString()} </Text>
        <Text>Last Updated: {item.dateUpdate.toISOString()} </Text>
      </>
      }

      
      
      <Button style={styles.inputbox}
        disabled={saveBtnDisable}
        onPress={() => {
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
            "crypto_name_short": itemCryptoShort,
            "crypto_contract_addr": itemCryptoContractAddr,
            "chainId": itemCryptoChainId,
            "crypto_price_ezread": itemPriceCryptoEzread,
            "dateCreate": newCreateDate
          }
        )
      }}>
        {saveBtnText}
      </Button>
    </Card>
    </Layout>
  )
};

const styles = StyleSheet.create({
  modalcontainer: {
    minWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%' , 
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 2,
  },
  inputbox: {
    marginVertical: 2,
    width: '100%' ,
  },
  inputTextStyle: {
    minHeight: 64,
  },
});