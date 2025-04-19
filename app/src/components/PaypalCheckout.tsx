import { useRef, useState, useEffect } from 'react';
import React from 'react';
import { useSDK } from '@metamask/sdk-react';
import DeviceInfo from 'react-native-device-info'
import { CreditCardInput } from "react-native-credit-card-input";
import Spinner from 'react-native-loading-spinner-overlay';
//import create from 'braintree-web-dropin';
//var braintreeDropin = require('braintree-web-drop-in').create;
var braintree = require('braintree-web/client');


//import braintree from "braintree-web-drop-in"
//import axios from 'axios';
import { url_local } from '../properties/urls_local'
import { url_dev } from '../properties/urls_dev'

import {
  Button,
  useStyleSheet,
  StyleService
} from '@ui-kitten/components';
import { PopoutQuestionBox } from '../components/YesNoConfirmBox';
import { Platform, StyleSheet, Text, View } from 'react-native';

//import { requestOneTimePayment, requestBillingAgreement, requestDeviceData } from 'react-native-paypal'; 

// For device data collection see: https://developers.braintreepayments.com/guides/advanced-fraud-management-tools/device-data-collection/
//const { deviceData } = await requestDeviceData('sandbox_6mkqpnhy_by5njgvk52fwvjqw');

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
  airdropReceiverAddr: string;
};

export const PaypalCheckout = ({ airdropReceiverAddr }): React.ReactElement => {
  /*
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
   */
  
  interface dvInfo { 
    carrier: string,
    device: string,
    bundleId: string,
    deviceName: string,
    buildNumber: string,
    ip:  string,
    mac:  string,
    manufacturer: string,
    version: string
    isEmulator: boolean
  }

  type creditCardInfo = { 
    number: string,
    expirationDate: string,
    cvv: string,
    billingAddress: {
      postalCode: string,
      address:string
    },
  }
  

  // ---------------State variables--------------- 
  const anchorRef = useRef(null);
  const verifiedCreditcardRef = useRef({
    "number": '',
    "expirationDate": '',
    "cvv": '',
    "billingAddress": {
      "postalCode": '',
      "address": ''
    },
  });
  //const [braintree, setBraintree] = useState(dropin);
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [loadingDisable, setLoadingDisable] = useState(false);
  const [ready4transaction, setReady4transaction] = useState(false);
  const [targetAmount, setTargetAmount] = useState("0");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [confirmBoxVisible, setConfirmBoxVisible] = useState(false);
  const [dvInfo2send, setDvInfo2send] = React.useState<dvInfo>(
    {
      "carrier": '',
      "device": '',
      "bundleId": '',
      "deviceName": '',
      "buildNumber": '',
      "ip": '',
      "mac": '',
      "manufacturer": '',
      "version": '',
      "isEmulator": false
    }
  );
  /*
  const [verifiedCreditcard, setVerifiedCreditcard] = React.useState<creditCardInfo>(
    {
      "number": '',
      "expirationDate": '',
      "cvv": '',
      "billingAddress": {
        "postalCode": '',
        "address": ''
      },
    }
  );
  */
  const [chainListVisible, setChainListVisible] = React.useState(false);

  // ---------------Style Sheets--------------- 

  const styles = useStyleSheet(StyleService.create({
    topNav: {
      flex: 1,
      backgroundColor: 'color-warning-400', 
      //height: 10
    },
    topNav2: {
      flex: 1,
    },
    container: {
    },
    buyButton: {
      margin: 2,
    },
  }));

  const stylesOverlay = useStyleSheet(StyleService.create({
    spinnerTextStyle: {
      color: '#FFF'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5
    }
  }));

  // ---------------Visual Items--------------- 
  const instructions = Platform.select({
    ios: 'Verification in progress',
    android:
      'Please hold,\n' +
      'Verification in progress'
  });

  // ---------------onPress Handler---------------
  const getDvInfo = () => {

    const deviceInfo = {
      "carrier": '',
      "device": '',
      "bundleId": '',
      "deviceName": '',
      "buildNumber": '',
      "ip": '',
      "mac": '',
      "manufacturer": '',
      "version": '',
      "isEmulator": false
    }
    /* Android only
    DeviceInfo.getDevice().then((device) => {
      // "walleye"
    });
    let deviceId = DeviceInfo.getDeviceId();
    DeviceInfo.getDeviceName().then((deviceName) => {
      // iOS: "Becca's iPhone 6"
      // Android: ?
      // Windows: ?
    });
    DeviceInfo.getHost().then((host) => {
      // "wprd10.hot.corp.google.com"
    });
    DeviceInfo.getLastUpdateTime().then((lastUpdateTime) => {
      // Android: 1517681764992
    });
    DeviceInfo.isAirplaneMode().then((airplaneModeOn) => {
      // false
    });
    DeviceInfo.getHardware().then(hardware => {
      // "walleye"
    });
    */

    /* iOS only
    DeviceInfo.syncUniqueId().then((uniqueId) => {
      // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
      // Android: "dd96dec43fb81c97"
      // Windows: ?
    });
    */

    let buildNumber = DeviceInfo.getBuildNumber();
    deviceInfo.buildNumber=buildNumber
    let bundleId = DeviceInfo.getBundleId();
    deviceInfo.bundleId =bundleId
    DeviceInfo.getCarrier().then((carrier) => {
      // "SOFTBANK"
      deviceInfo.carrier=carrier
    });
    
    
    DeviceInfo.getIpAddress().then((ip) => {
      // "92.168.32.44"
      deviceInfo.ip=ip
    });
    
    DeviceInfo.getMacAddress().then((mac) => {
      // "E5:12:D8:E5:69:97"
      deviceInfo.mac=mac
    });
    DeviceInfo.getManufacturer().then((manufacturer) => {
      // iOS: "Apple"
      // Android: "Google"
      // Windows: ?
      deviceInfo.manufacturer=manufacturer
    });
    
    let version = DeviceInfo.getVersion();
    // iOS: "1.0"
    // Android: "1.0" or "1.0.2-alpha.12"
    // Windows: ?
    deviceInfo.version=version
    
    DeviceInfo.isEmulator().then((isEmulator) => {
      // false
      deviceInfo.isEmulator=isEmulator
    });

    setDvInfo2send(deviceInfo)
  } 

  const onCreditCardChange = async(form: any) => {
    //console.log(form);
    /*
    // will print:
    {
      valid: true, // will be true once all fields are "valid" (time to enable the submit button)
      values: { // will be in the sanitized and formatted form
        number: "4242 4242",
        expiry: "06/19",
        cvc: "300",
        type: "visa", // will be one of [null, "visa", "master-card", "american-express", "diners-club", "discover", "jcb", "unionpay", "maestro"]
      },
      status: {  // will be one of ["incomplete", "invalid", and "valid"]
      number: "incomplete",
      expiry: "incomplete",
      cvc: "incomplete",
      },
    };
    */
   //4111111111111111
   // 10/20 CVV 123
   //4242424242424242 
   //processor declined:
   //4000111111111115
   //failed (3000)
   //3566002020360505
   // https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live/node
    //setLoadingDisable(true)
    setReady4transaction(false)
    if (form.valid) {
      //setLoadingDisable(true)
      console.log("card filled, going to verification process")
      verifiedCard(form)
    } else {
      console.log("Car NOT yet valid")
      const blankCard = {
        "number": '',
        "expirationDate": '',
        "cvv": '',
        "billingAddress": {
          "postalCode": '',
          "address": ''
        },
      }
      verifiedCreditcardRef.current = blankCard
      setReady4transaction(false)
    }
  }

  const verifiedCard = async (cardinfo: any) => {
    console.log("verifiedCard")
    setReady4transaction(false)
    getDvInfo()
    fetch(url.braintree_getClientTokenRequest).then(responseFromBraintree => responseFromBraintree.text()
      //{console.log("responseFromBraintree",responseFromBraintree)}
    ).then((text) => {
      console.log("text",text);
      var b = Buffer.from(text, 'base64')
      var json = b.toString();
      console.log("json",json);
      
      braintree.create(
        {
          authorization: text,
        },
        function (err: any, client: any) {
          console.log("client",client)
          //console.log("cardinfo",cardinfo)
          //console.log("number",cardinfo.values.number)
          if (err) {
            console.log(err);
            if (err.code === 'CLIENT_AUTHORIZATION_INVALID') {
              // either the client token has expired, and a new one should be generated
              // or the tokenization key was deactivated or deleted
            } else {
              console.log('something went wrong creating the client instance when verify card', err);
            }
            setLoadingDisable(false)
            return;
          }
          
          client.request(
            {
              endpoint: "payment_methods/credit_cards",
              method: "post",
              data: {
                creditCard: {
                  number: cardinfo.values.number,
                  expirationDate: cardinfo.values.expiry,
                  cvv: cardinfo.values.cvc,
                  billingAddress: {
                    postalCode: "12345",
                  },
                },
              },
              
            },
            function cb(err: any, response: any) {
              console.log("Response before createTransaction verifyTransaction")
              console.log(response);
              console.log("Nonce:")
              console.log(response.creditCards[0].nonce);
              
              const header = {
                headers: {
                  'Content-Type': 'application/json',
                  'nonce': response.creditCards[0].nonce,
                  'amount': '1',
                  'currency': 'GBP'
                }
              };
              // Send response.creditCards[0].nonce to your server
              //axios.post("http://paypalbraintreeserver-dev.dionys.xyz/verifyCreditCard",
              fetch(url.braintree_verifyCreditCard,{
                headers: {
                  'Content-Type': 'application/json',
                  'nonce': response.creditCards[0].nonce,
                  'amount': '1',
                  'currency': 'GBP'
                }
              }
              ).then((response2FromBraintree) => response2FromBraintree.json()
              ).then((json) => {
                setLoadingDisable(false)
                setReady4transaction(true)
                //setNonce(json.creditCards[0].nonce)
                console.log("Response of verifyCreditCard")
                console.log(json)
                
                if (dvInfo2send.isEmulator) {
                  verifiedCreditcardRef.current = {
                    "number": "4111111111111111",
                    "expirationDate": "10/20",
                    "cvv": "123",
                    "billingAddress": {
                      "postalCode": "12345",
                      "address": "yourAddress"
                    },
                  }
                } else {
                  verifiedCreditcardRef.current ={
                    "number": cardinfo.values.number,
                    "expirationDate": cardinfo.values.expiry,
                    "cvv": cardinfo.values.cvc,
                    "billingAddress": {
                      "postalCode": "12345",
                      "address": "yourAddress"
                    },
                  }
                }

              })
            }
          );
        }
      );
      
    })
    
  }


  const createTransaction = async (amount:string, fiatCurrency:string) => {
    setLoadingDisable(true)
    console.log("Ready2Call getClientTokenRequest");

    //axios.get("http://10.0.2.2:8088/getClientTokenRequest").then((responseFromBraintree) => {
    fetch(url.braintree_getClientTokenRequest

    ).then((responseFromBraintree) => responseFromBraintree.text()
    ).then((text) => {
      console.log(text);
      
      /*
      braintreeDropin({
        authorization: responseFromBraintree.data,
        //authorization: 'CLIENT_AUTHORIZATION',
        container: '#dropin-container', 
        paypal: {
          flow: 'checkout',
          amount: '10.00',
          currency: 'USD'
          //flow: 'vault'
        }
      }).then(() => {
        console.log("requestPaymentMethod");
        //console.log(responseFromPaypal.requestPaymentMethod)
      }).catch((error: any) => { 
        console.log("catch");
        console.log(error);
        //throw error; 
      });
      */
      
      
      braintree.create(
        {
          authorization: text,
          //container: '#dropin-container', 
          //paypal: {
            //flow: 'checkout',
            //amount: '10.00',
            //currency: 'USD'
            //flow: 'vault'
          //},
          //debug: true
        },
        async function (err: any, client: any) {
          console.log(client)
          if (err) {
            console.log(err);
            if (err.code === 'CLIENT_AUTHORIZATION_INVALID') {
              // either the client token has expired, and a new one should be generated
              // or the tokenization key was deactivated or deleted
            } else {
              console.log('something went wrong creating the client instance when create transaction', err);
            }
            return;
          }
          console.log("verifiedCreditcardRef",verifiedCreditcardRef.current.number)
          console.log("verifiedCreditcardRef",verifiedCreditcardRef.current.expirationDate)
          console.log("verifiedCreditcardRef",verifiedCreditcardRef.current.cvv)

          client.request(
            {
              endpoint: "payment_methods/credit_cards",
              method: "post",
              data: {
                creditCard: {
                  number: verifiedCreditcardRef.current.number,
                  expirationDate: verifiedCreditcardRef.current.expirationDate,
                  cvv: verifiedCreditcardRef.current.cvv,
                  billingAddress: {
                    postalCode: "12345",
                  },
                },
              },
            },
            
            async function cb(err: any, response: any) {
              console.log("DeviceInfo:")
              console.log(dvInfo2send);
              console.log("Response before createTransaction")
              console.log(response);
              console.log("Nonce:")
              console.log(response.creditCards[0].nonce);
              
              /*
              const header = {
                headers: {
                  'Content-Type': 'application/json',
                  'nonce': response.creditCards[0].nonce,
                  'amount': amount,
                  'currency': fiatCurrency
                }
              }
              */
              // Send response.creditCards[0].nonce to your server
              console.log("Ready to fetch the create Transaction",url.braintree_createTransaction);

              try {

                var dvInfo2sendStr = JSON.stringify(dvInfo2send)
                console.log("dvInfo2sendStr",dvInfo2sendStr)
                const response2 = await fetch(url.braintree_createTransaction, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive',
                    'amount': amount,
                    'currency': fiatCurrency,
                    'toAddr': airdropReceiverAddr,
                    'tokenContractAddr': '0xc',
                    'nonce': response.creditCards[0].nonce
                  },
                  body: dvInfo2sendStr
                }
                ).then((response2FromBraintreeServer) => response2FromBraintreeServer.text()
                ).then((text) => {
                  console.log("Response of createTransaction")
                  console.log(text);
                  setChainListVisible(false)
                })
              } catch(err) {
                  console.error('err.message:', err);
              }

              
              
            }
          );
          

        }
      );
      
      
      

    });
    setLoadingDisable(false)
  };

  // For vaulting paypal account see: https://developers.braintreepayments.com/guides/paypal/vault
  /*
  const {
    nonce,
    payerId,
    email,
    firstName,
    lastName,
    phone
  } = await requestBillingAgreement(
    token,
    {
      billingAgreementDescription: 'Your agreement description', // required
      // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
      currency: 'GBP',
      // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
      localeCode: 'en_GB',
    }
  );
  */
  
//Merchant ID:
//by5njgvk52fwvjqw
//Public Key:
//hth2zxrqy38dkym4
//Private Key:
//f2becd06e2b370f726cbf7488300909a
//CSE Key:
//MIIBCgKCAQEAzznj3l815M1lvjhE3dtd8/ICiuBPhyiYlP82IRoDvbrq898FUHhxyojfHmuonTD0XkGswaH8r3rCGZGuvvSA4x6Ni22QuSFVfUslfGZ8gLAWLdzYI23iX1RviBkJVS66gkCPluhxUBWC+pj8UZGOGSdKZ3x123e+MoY0B2IF0QqpSCO5UvT+G3ZQHt5JY0Au01k+jLoobt4IR4x8/flmbWLSuBuWsY0lY+xt9TPubsaqu4RxUurxYocq37ARHTEPMOOS1evkBKWXCDHEw+Xy4acCguuXIeVLQsZto2o/OgeXcAiYEsGtEFCQAe/bwcHlIEy9DeB4KOJ7jyxv0vnZlwIDAQAB
//Tokenized key:
//sandbox_6mkqpnhy_by5njgvk52fwvjqw

  useEffect(() => {
    /*
    if (Cookies.get('langIndex')) {
      const i = Cookies.get('langIndex')
      setCurrentLang(i)
      onChangeLang(LANGS[i].value)
    }
    */
  })
  

  return (
    <>
      <Spinner
        visible={loadingDisable}
        textContent={'Verification in progress...'}
        textStyle={stylesOverlay.spinnerTextStyle}
      />

      <CreditCardInput onChange={onCreditCardChange}/>
      
      { ( ready4transaction )? 
      <>
      <Button
      //appearance='ghost'
      style={styles.buyButton}
      status='danger'
      onPress={() => {
        setConfirmBoxVisible(true) 
        setTargetCurrency("GBP")
        setTargetAmount("1000")}
        //createTransaction(targetAmount,targetCurrency)}
      }
      >
        Buy $1000
      </Button>
      <Button
      //appearance='ghost'
      style={styles.buyButton}
      status='danger'
      onPress={ () => {
        setConfirmBoxVisible(true) 
        setTargetCurrency("GBP")
        setTargetAmount("5000")}
        //createTransaction(targetAmount,targetCurrency)}
      }
      >
        Buy $5000
      </Button>
      </>
     : null }
      { (  confirmBoxVisible)? 
      <>
      <PopoutQuestionBox amount={targetAmount} fiatCurrency={targetCurrency} airdropReceiverAddr={airdropReceiverAddr} onConfirm={() => createTransaction(targetAmount, targetCurrency)} onCancel={() => setConfirmBoxVisible(false)} />
      </>
      : null }
      
    </>
  );
}
