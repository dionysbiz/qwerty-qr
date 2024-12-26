import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, IndexPath, Card, Text, Layout, Select, SelectItem, MenuItem, Input, OverflowMenu } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import { useSDK } from '@metamask/sdk-react';
import { Linking } from 'react-native';

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
  deleteOrderHandler: any ,
};

export const QROrderViewCard = ({ item, deleteOrderHandler }): React.ReactElement => {
  // ---------------State variables--------------- 
  const [currentLang, setCurrentLang] = useState("en");
  //const [itemDetailModalVisible, setItemDetailModalVisible] = useState(false);
  const [CHAINTOKENLISTVisible, setCHAINTOKENLISTVisible] = React.useState(false);

  const [itemId, setItemId] = useState(item.id);
  const [itemName, setItemName] = useState(item.name);
  //const [itemDescription, setItemDescription] = useState(item.description);
  const [itemCryptoShort, setItemCryptoShort] = useState(item.crypto_name_short);
  const [itemCryptoContractAddr, setItemCryptoContractAddr] = useState(item.crypto_contract_addr);
  const [itemCryptoChainId, setItemCryptoChainId] = useState(item.crypto_chain_id);
  const [itemPriceCryptoEzread, setItemPriceCryptoEzread] = useState(item.crypto_price_ezread);
  const [itemFromAddr, setItemFromAddr] = useState(item.fromAddr);
  const [itemTxHash, setItemTxHash] = useState(item.txHash);
  const [itemDateCreate, setItemDateCreate] = useState(item.dateCreate);
  const [itemDateUpdate, setItemDateUpdate] = useState(item.dateUpdate);
  const [urlBlockScan, setUrlBlockScan] = useState("");
  const [chainName, setChainName] = useState("")

  const [tokenShortDisplayValue, setTokenShortDisplayValue] = useState("Select token");
  const [saveBtnDisable, setSaveBtnDisable] = useState(true);
  const [visibleDelete, setVisibleDelete] = useState(true);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);

  //const [placementIndex, setPlacementIndex] = React.useState(new IndexPath(1, 0));
  //const placement = placements[placementIndex.row];

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
    console.log(itemCryptoChainId)
    switch (itemCryptoChainId) {
      case '0x1':
        setUrlBlockScan("https://etherscan.io/")
        setChainName("Ethereum Mainnet")
        break;
      case '0xa4b1': //AR
        setUrlBlockScan("https://arbiscan.io/")
        setChainName("Arbitrum")
        break;
      case '0xa': //OP
        setUrlBlockScan("https://optimistic.etherscan.io/")
        setChainName("OP Mainnet")
        break;
      default:
        setUrlBlockScan("")
    }
    
  })

  return (
    <Layout style={styles.modalcontainer}>
    <Card style={styles.container} disabled={true}>
      <Text>OrderId: {itemId}</Text>
      <Text>Date/Time: {item.dateCreate.toISOString()}</Text>
      <Text>  </Text>
      <Text>Name: {itemName}</Text>
      <Text>Crypto: {itemCryptoShort}</Text>
      <Text>Price: {itemPriceCryptoEzread}</Text>
      <Text>  </Text>
      <Text>From: ..{itemFromAddr.substring(20)}</Text>
      <Text>BlockChain: {chainName}</Text>
      <Button
        size='small' 
        style={styles.button}
        onPress={ () => Linking.openURL(urlBlockScan+"tx/"+itemTxHash)}>
        Transaction Detail
      </Button>
      <Button
        size='small' 
        style={styles.button}
        onPress={ () => Linking.openURL(urlBlockScan+"address/"+itemCryptoContractAddr)}>
        Crypto Contract Address
      </Button>
      <Text>  </Text>
      {visibleDelete && (<Button
        size='small' 
        appearance='ghost'
        status='danger'
        style={styles.button}
        onPress={ () => {
          setVisibleDelete(false)
          setVisibleConfirmDelete(true)
          }}>
        DELETE Order
      </Button>)}
      {visibleConfirmDelete && (<Button
        size='small' 
        status='danger'
        style={styles.button}
        onPress={ () => {
          setVisibleDelete(true)
          setVisibleConfirmDelete(false)
          deleteOrderHandler(item)
        }}>
        CONFIRM DELETE
      </Button>)}
      
      
      
      {/*
      
      <Text>{itemDateCreate}</Text>
      
      {itemId !== '' &&
      <>
        <Text>Date Created: {itemDateCreate.toISOString()} </Text>
      </>
      }
      */}

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