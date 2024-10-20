import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, useColorScheme, View  } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Divider, Layout, Card, Text } from '@ui-kitten/components';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { zhHK, en } from '../translate';

import { PaymentScreen } from './PaymentScreen';
import { NavigationContainer } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

import axios from 'axios';

export type Props = {
  navigation: any,
};

export const BuyCryptoScreen = ({ navigation }) : JSX.Element => {
  // ---------------State variables---------------
  const [ethRate, setEthRate] = useState(0); 
  const [gasPrice, setGasPrice] = useState(0);
  const [minTxFeeEther, setMinTxFeeEther] = useState(0);
  const [minTxFeeGwei, setMinTxFeeGwei] = useState(0);
  const [minTxFeeUSD, setMinTxFeeUSD] = useState(0);

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
  

  
  // ---------------navigate function--------------- 


  
  const navigatePayment = () => {
    navigation.navigate('PaymentScreen');
  };

  // ---------------onPress Handler---------------
  
  function promiseHttpGasPrice () {
    axios.post('https://mainnet.infura.io/v3/139a076676e1447094981c79ac0b6acc', {
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }}
    ).then((responseGasPrice) => {
      setGasPrice(Number(responseGasPrice.data.result)/1000000000)
      setMinTxFeeEther(gasPrice*65000*0.000000001)
      setMinTxFeeGwei(gasPrice*65000)
      setMinTxFeeUSD(minTxFeeEther*2649.68)
    })
    
    return "";
  }

  function getHttpEthRate () {
    axios.get('https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000',
    {
      headers: {
        'Content-Type': 'application/json'
      }}
    ).then((responseGasPrice) => {
      setEthRate(Number(responseGasPrice.data.Price))
    })
    
    return "";
  }

  //

  useEffect(() => {
    //promiseHttpGasPrice()
    getHttpEthRate()
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
      <Layout
        style={styles.topContainer}
        level='1'
      >

        <Card
          style={styles.card}
          footer={Footer}
        >
          <Text>
            Mainnet Etherum
          </Text>
        </Card>

        <Card
          style={styles.card}
          footer={Footer}
        >
          <Text>
            USDT
          </Text>
        </Card>

      </Layout>

      <Layout
        style={styles.topContainer}
        level='1'
      >

        <Card
          style={styles.card}
          footer={Footer}
        >
          <Text>
            Mainnet ERC20
          </Text>
        </Card>

        <Card
          style={styles.card}
          footer={Footer}
        >
          <Text>
            L2 ERC20
          </Text>
        </Card>

      </Layout>
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