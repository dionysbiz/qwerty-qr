import { useRef, useState, useEffect } from 'react';
import React from 'react';
import { useSDK } from '@metamask/sdk-react';
//import create from 'braintree-web-dropin';
//var braintreeDropin = require('braintree-web-drop-in').create;
var braintree = require('braintree-web/client');




//import braintree from "braintree-web-drop-in"


import axios from 'axios';

import {
  Button,
  useStyleSheet,
  StyleService
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

//import { requestOneTimePayment, requestBillingAgreement, requestDeviceData } from 'react-native-paypal'; 

// For device data collection see: https://developers.braintreepayments.com/guides/advanced-fraud-management-tools/device-data-collection/
//const { deviceData } = await requestDeviceData('sandbox_6mkqpnhy_by5njgvk52fwvjqw');

export type Props = {

};

export const PaypalCheckout = ({ }): React.ReactElement => {
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
  
  // ---------------State variables--------------- 
  const anchorRef = useRef(null);
  //const [braintree, setBraintree] = useState(dropin);
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
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
  }));

  // ---------------Visual Items--------------- 


  // ---------------onPress Handler--------------- 

  const requestBrainTreeClientToken = async () => {
    console.log("Ready2Call getClientTokenRequest");

    axios.get("http://10.0.2.2:8088/getClientTokenRequest").then((responseFromBraintree) => {
      console.log(responseFromBraintree.data);
      
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
          authorization: responseFromBraintree.data,
          //container: '#dropin-container', 
          //paypal: {
            //flow: 'checkout',
            //amount: '10.00',
            //currency: 'USD'
            //flow: 'vault'
          //},
          //debug: true
        },
        function (err: any, client: any) {
          //console.log(client)
          if (err) {
            console.log(err);
            if (err.code === 'CLIENT_AUTHORIZATION_INVALID') {
              // either the client token has expired, and a new one should be generated
              // or the tokenization key was deactivated or deleted
            } else {
              console.log('something went wrong creating the client instance', err);
            }
            return;
          }
          client.request(
            {
              endpoint: "payment_methods/credit_cards",
              method: "post",
              data: {
                creditCard: {
                  number: "4111111111111111",
                  expirationDate: "10/20",
                  cvv: "123",
                  billingAddress: {
                    postalCode: "12345",
                  },
                },
              },
            },
            function cb(err: any, response: any) {
              console.log('this is call back');
              console.log(err);
              console.log(response);
              // Send response.creditCards[0].nonce to your server
            }
          );
        }
      );
      
      
      
    });
    
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
      <Button
        //appearance='ghost'
        status='danger'
        onPress={requestBrainTreeClientToken}
      >
      PAYPAL
      </Button>

      <Button onPress={requestBrainTreeClientToken} >
        Paypal BrainTree ClientToken
      </Button>

      

    </>
  );
}
