import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, useColorScheme, View  } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Divider, Layout, Card, Text } from '@ui-kitten/components';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { zhHK, en } from '../translate';
import { PaymentScreen } from './PaymentScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useSDK } from '@metamask/sdk-react';
import Spinner from 'react-native-loading-spinner-overlay';

//import axios from 'axios';

export type Props = {
  navigation: any,
};

export const BuyCryptoScreen = ({ navigation }) : JSX.Element => {
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

  // ---------------Style Sheets--------------- 
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  
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
        Buy Mainnet Eth
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
  

  
  // ---------------navigate function--------------- 


  
  const navigatePayment = () => {
    navigation.navigate('PaymentScreen', {
      fiatCurrency: fiatCurrency,
      targetChainId: targetChainId,
      targetChainName: targetChainName,
      targetBlockExplorerUrls: targetBlockExplorerUrls,
      targetNativeCurrency: targetNativeCurrency,
      targetRpcUrls: targetRpcUrls
    });
  };

  // ---------------onPress Handler---------------
  
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
      <Card
        style={styles.card}
      >
        <Text>
          ETH/USD: ${ethRate.toFixed(2)}
        </Text>
        <Text>
          Min GasPrice: {gasPrice.toFixed(2)} Gwei 
        </Text>
        <Text>
          Min Tx Fee in Gwei: {minTxFeeGwei.toFixed(2)} Gwei
        </Text>
        <Text>
          Min Tx Fee in USD: $ {minTxFeeUSD.toFixed(2)} 
        </Text>
      </Card>

      { chainId==='0x1' ? 
      <>
      <Layout
        style={styles.topContainer}
        level='1'
      >

        <Card
          style={styles.card}
          footer={FooterMainnetEtherum}
          onPress={onPressMainnetETH}
        >
          <Text>
            Mainnet Etherum
          </Text>
        </Card>

        <Card
          style={styles.card}
          footer={FooterMainnetUSDT}
          onPress={onPressMainnetUSDT}
        >
          <Text>
            Mainnet USDT
          </Text>
        </Card>

      </Layout>
      <Layout
        style={styles.topContainer}
        level='1'
      >

        <Card
          style={styles.card}
          footer={FooterMainnetERC20}
          onPress={onPressMainnetERC20JPY}
        >
          <Text>
            Mainnet ERC JPY
          </Text>
        </Card>

        <Card
          style={styles.card}
          footer={FooterMainnetERC20}
          onPress={onPressMainnetERC20HKD}
        >
          <Text>
          Mainnet ERC HKD
          </Text>
        </Card>

      </Layout>
      </>
      : chainId==='0xa4b1' ? 
      // Arbitrum
      <>
      <Layout
        style={styles.topContainer}
        level='1'
      >

        <Card
          style={styles.card}
          footer={FooterL2Arbitrum}
          onPress={onPressL2ArbitrumERC20JPY}
        >
          <Text>
            L2 Arbitrum ERC20 JPY
          </Text>
        </Card>

        <Card
          style={styles.card}
          footer={FooterL2Arbitrum}
          onPress={onPressL2ArbitrumERC20HKD}
        >
          <Text>
            L2 Arbitrum ERC20 HKD
          </Text>
        </Card>

      </Layout>
      <Layout
        style={styles.topContainer}
        level='1'
      >

        <Card
          style={styles.card}
          footer={FooterL2Arbitrum}
          onPress={onPressL2ArbitrumEth}
        >
          <Text>
            L2 Arbitrum Etherum
          </Text>
        </Card>

      </Layout>
      </>
      : chainId==='0xa' ? 
      // OP Mainnet
      <>
      <Layout
        style={styles.topContainer}
        level='1'
      >

        <Card
          style={styles.card}
          footer={FooterL2OpMainnet}
          onPress={onPressL2OptimismEth}
        >
          <Text>
            L2 OP Etherum
          </Text>
        </Card>

        <Card
          style={styles.card}
          footer={FooterL2OpMainnet}
          onPress={onPressL2OptimismERC20HKD}
        >
          <Text>
            L2 OP ERC20 HKD
          </Text>
        </Card>

      </Layout>
      </>
      : null }
      
      <Divider />
      <Layout style={{ flex: 1, alignItems: 'center' }}>
        <Button style={styles.tokenPurchaseRecordBtn}>
          Check your token Purchase Records
        </Button>
        
      </Layout>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
  tokenPurchaseRecordBtn: {
    margin: 2,
  },
});