import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, useColorScheme, View, Modal  } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { withStyles } from '@ui-kitten/components';
import { Button, Divider, Layout, Card, Text, useStyleSheet, StyleService,  List, ListItem } from '@ui-kitten/components';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { languagesList } from '../translate';

import { PaymentScreen } from './PaymentScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useSDK } from '@metamask/sdk-react';
import Spinner from 'react-native-loading-spinner-overlay';

import { url_local } from '../properties/urls_local'
import { url_dev } from '../properties/urls_dev'

import AIAssistant from "../components/AIAssistant";


import DeviceInfo from 'react-native-device-info'

//import axios from 'axios';

var url:any = ""

DeviceInfo.isEmulator().then((isEmulator) => {
  if (isEmulator) {
    //url = url_local;
    url = url_dev;
  } else {
    url = url_dev;
  }
});

export type Props = {
  navigation: any,
  handleLangChange: any,
  langPack: any
};

export const BuyCryptoScreen = ({ navigation, handleLangChange, langPack }) : JSX.Element => {
  // ---------------State variables---------------
  const [ethRate, setEthRate] = useState(0); 
  const [gasPrice, setGasPrice] = useState(0);
  const [fiatCurrency, setFiatCurrency] = useState("");

  const [targetChainId, setTargetChainId] = useState("")
  const [targetChainName, setTargetChainName] = useState("")
  const [targetBlockExplorerUrls, setTargetBlockExplorerUrls] = useState("")
  const [targetNativeCurrency, setTargetNativeCurrency] = useState("")
  const [targetRpcUrls, setTargetRpcUrls] = useState("")

  const [minTxFeeEther, setMinTxFeeEther] = useState(0);
  const [minTxFeeGwei, setMinTxFeeGwei] = useState(0);
  const [minTxFeeUSD, setMinTxFeeUSD] = useState(0);

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

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

  const selectLanguage = (languageCode: string) => {
    console.log(`Selected language: ${languageCode}`);
    setLanguageModalVisible(false);
    // Add logic to update the app's language here
    handleLangChange(languageCode);
  };

  const renderLanguageItem = ({ item }) => (
    <ListItem
      title={item.name}
      onPress={() => selectLanguage(item.code)}
    />
  );

  

  // ---------------Style Sheets--------------- 
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  const evastyles = useStyleSheet(StyleService.create({
    button: {
      margin: 2,
      backgroundColor: 'color-info-transparent-600', 
    },
    container: {
    },
  }));

  const styles = StyleSheet.create({
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    card: {
      flex: 1,
      margin: 2,
      backgroundColor: 'rgba(0, 149, 255, 0.24)',
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    footerControl: {
      marginHorizontal: 2,
    },
    tokenPurchaseRecordBtn: {
      margin: 2,
      backgroundColor: 'color-primary-default',
    },
  });

  
  // ---------------Visual Items--------------- 
  const isDarkMode = useColorScheme() === 'dark';

  const Header = (props: ViewProps): React.ReactElement => (
    <View {...props}>
      <Text category='h6'>
        {props.shortName}
      </Text>
      <Text category='s2'>
        {props.chainName}
      </Text>
    </View>
  );
  
  const Footer = (props: ViewProps): React.ReactElement => (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
      <Button
        style={styles.footerControl}
        size='small'
        onPress={navigatePayment}
      >
        Buy
      </Button>
      
    </View>
  );

  const FooterMainnetEtherum = (props: ViewProps): React.ReactElement => (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
     
      <Button
        style={styles.footerControl}
        size='small'
        onPress={navigatePayment}
        disabled={!connected}
      >
        Buy our Crypto
      </Button>

      
    </View>
  );

  const FooterMainnetUSDT = (props: ViewProps): React.ReactElement => (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
      <Button
        style={styles.footerControl}
        size='small'
        onPress={ () => {
      
          navigatePayment
        }}
        disabled={!connected}
      >
        Buy
      </Button>
      
    </View>
  );

  const FooterMainnetERC20 = (props: ViewProps): React.ReactElement => (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
      <Button
        style={styles.footerControl}
        size='small'
        onPress={ () => {
          navigatePayment
        }}
        disabled={!connected}
      >
        Buy
      </Button>
      
    </View>
  );

  const FooterL2Arbitrum = (props: ViewProps): React.ReactElement => (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
      <Button
        style={styles.footerControl}
        size='small'
        onPress={ () => {
          navigatePayment
        }}
        disabled={!connected}
      >
        Buy
      </Button>
      
    </View>
  );

  const FooterL2OpMainnet = (props: ViewProps): React.ReactElement => (
    <View
      {...props}
      // eslint-disable-next-line react/prop-types
      style={[props.style, styles.footerContainer]}
    >
      <Button
        style={styles.footerControl}
        size='small'
        onPress={ () => {navigatePayment}}
        disabled={!connected}
      >
        Buy
      </Button>
      
    </View>
  );

  const LanguageList = (props: ViewProps): React.ReactElement => (
    <Modal
      visible={isLanguageModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <Card disabled={true} style={{ width: '80%', padding: 20 }}>
          <Text category="h6" style={{ marginBottom: 10 }}>
            {langPack.button_language_pleaseselect}
          </Text>
          <List
            data={languagesList}
            renderItem={renderLanguageItem}
          />
          <Button style={{ marginTop: 10 }} onPress={() => setLanguageModalVisible(false)}>
            {langPack.button_language_close}
          </Button>
        </Card>
      </View>
    </Modal>
  );
  
  

  
  // ---------------navigate function--------------- 


  
  const navigatePayment = () => {
    navigation.navigate('PaymentScreen', {
      fiatCurrency: fiatCurrency,
      targetChainId: targetChainId,
      targetChainName: targetChainName,
      targetBlockExplorerUrls: targetBlockExplorerUrls,
      targetNativeCurrency: targetNativeCurrency,
      targetRpcUrls: targetRpcUrls,
      airdropReceiverAddr: account
    });
  };

  // ---------------onPress Handler---------------
  const abierc20 = require('../abi/TTK.json');
  async function sendTestOrder() {
    //console.log("sendTestOrder")
    //console.log(url.ws_graphqlSubscription)
    console.log(abierc20)


  }
  
  async function promiseHttpGasPrice () {
    const responseGasPrice = await fetch('https://mainnet.infura.io/v3/139a076676e1447094981c79ac0b6acc', {
      method: 'POST',
      body: JSON.stringify({  
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1
      }), 
      headers: {
        'Content-Type': 'application/json'
      }}
    )
    const json = await responseGasPrice.json();

    
    setGasPrice(Number(json.result)/1000000000)
    setMinTxFeeEther(gasPrice*65000*0.000000001)
    setMinTxFeeGwei(gasPrice*65000)
    setMinTxFeeUSD(minTxFeeEther*2649.68)

    
    return "";
  }

  async function getHttpEthRate () {
    const responseEthPrice = await fetch('https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000',
      {
        headers: {
          'Content-Type': 'application/json'
        }}
      )
  
    const json = await responseEthPrice.json();
  
    setEthRate(Number(json.Price))
    

    
    return "";
  }


  //-----------Mainnet--------------------
  
  function onPressMainnetETH () {
    setFiatCurrency("USD")
    
    setTargetChainId("0x1")
    setTargetChainName("Ethereum")
    setTargetBlockExplorerUrls("https://etherscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://mainnet.infura.io/v3/")

    navigatePayment()
  }

  function onPressMainnetUSDT () {
    setFiatCurrency("USD")

    setTargetChainId("0x1")
    setTargetChainName("Ethereum")
    setTargetBlockExplorerUrls("https://etherscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://mainnet.infura.io/v3/")

    navigatePayment()
  }

  function onPressMainnetERC20JPY () {
    setFiatCurrency("JPY")
    
    setTargetChainId("0x1")
    setTargetChainName("Ethereum")
    setTargetBlockExplorerUrls("https://etherscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://mainnet.infura.io/v3/")

    navigatePayment()
    
  }

  function onPressMainnetERC20HKD () {
    setFiatCurrency("HKD")
    
    setTargetChainId("0x1")
    setTargetChainName("Ethereum")
    setTargetBlockExplorerUrls("https://etherscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://mainnet.infura.io/v3/")

    navigatePayment()
    
  }

  //--------------L2 Arbitrum------------------
  function onPressL2ArbitrumEth () {
    setFiatCurrency("USD")

    setTargetChainId("0xa4b1")
    setTargetChainName("Arbitrum")
    setTargetBlockExplorerUrls("https://arbiscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://arbitrum.llamarpc.com/")

    navigatePayment()
  }

  function onPressL2ArbitrumERC20JPY () {
    setFiatCurrency("JPY")

    setTargetChainId("0xa4b1")
    setTargetChainName("Arbitrum")
    setTargetBlockExplorerUrls("https://arbiscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://arbitrum.llamarpc.com/")

    navigatePayment()
  }

  function onPressL2ArbitrumERC20HKD () {
    setFiatCurrency("HKD")

    setTargetChainId("0xa4b1")
    setTargetChainName("Arbitrum")
    setTargetBlockExplorerUrls("https://arbiscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://arbitrum.llamarpc.com/")

    navigatePayment()
  }

  //-------------L2 OP-----------------------

  function onPressL2OptimismEth () {
    setFiatCurrency("USD")

    setTargetChainId("0xa")
    setTargetChainName("OP Mainnet")
    setTargetBlockExplorerUrls("https://optimistic.etherscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://optimism-rpc.publicnode.com")

    navigatePayment()
  }

  function onPressL2OptimismERC20HKD () {
    setFiatCurrency("HKD")

    setTargetChainId("0xa")
    setTargetChainName("OP Mainnet")
    setTargetBlockExplorerUrls("https://optimistic.etherscan.io/")
    setTargetNativeCurrency("ETH")
    setTargetRpcUrls("https://optimism-rpc.publicnode.com")

    navigatePayment()
  }
  



  useEffect(() => {
    //promiseHttpGasPrice()
    getHttpEthRate()

    { account!=='' ? 
      //setConnect2Chain(true)
      console.log()
      :
      //setConnect2Chain(false)
      console.log()
    }
  })

  return (
    <>
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={styles.topContainer}
        level='2'
      >
          <Card
            style={styles.card}
          >
            <Text>
              ETH/USD: ${ethRate.toFixed(2)}
            </Text>
            <Text>
              GasPrice: {gasPrice.toFixed(2)} Gwei 
            </Text>
            <Text>
              Min Tx Fee in Gwei: {minTxFeeGwei.toFixed(2)} Gwei /USD$ {minTxFeeUSD.toFixed(2)} 
            </Text>
          </Card>
          { chainId==='0x1' ? 
          <>
            <Card
              style={styles.card}
              footer={FooterMainnetEtherum}
              onPress={onPressMainnetETH}
            >
              <Text>
                Buy our crypto in Mainnet
              </Text>
            </Card>
          </>
          : chainId==='0xa4b1' ?
          <>
            <Card
              style={styles.card}
              footer={FooterMainnetEtherum}
              onPress={onPressMainnetETH}
            >
              <Text>
                Buy our crypto in Testnet
              </Text>
            </Card>
            
          </>
        : null }
      </Layout>

      <AIAssistant />
      
      <Divider />

      <Layout level='1' style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10, maxHeight: 90}}>
        <Layout level='1' style={{justifyContent: 'center', alignItems: 'center' }}>
          <Button style={evastyles.button} onPress={() => sendTestOrder()}>
            Token Purchase Record
          </Button>
        </Layout>
        <Layout level='1' style={{justifyContent: 'center', alignItems: 'center'}}>
          <Button style={evastyles.button} onPress={() => setLanguageModalVisible(true)}>
            {langPack.button_language}
          </Button>
        </Layout>
      </Layout>
      <Layout level='1' style={{ flex: 1, flexDirection: 'row', maxHeight: 40}}>

      </Layout>

      <LanguageList/>

    </SafeAreaView>
    </>
  );
};

