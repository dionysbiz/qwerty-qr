import { useSDK } from '@metamask/sdk-react';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { Avatar, ApplicationProvider, Layout } from '@ui-kitten/components';
import { colors } from './colors';
import { ServiceStatusView } from './service-status-view';
import { ServiceStatus } from '@metamask/sdk';
import { ethers } from 'ethers';
import { PaypalCheckout } from '../components/PaypalCheckout';

export interface PaymentViewProps {}

const createStyles = ({ connected }: { connected: boolean }) => {
  return StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: connected ? colors.success.default : colors.warning.default,
      padding: 10,
      backgroundColor: colors.background.default,
    },
    button: {
      height: 30,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue',
    },
    title: {
      backgroundColor: '#a5c9ff',
      textAlign: 'center',
      padding: 10,
    },
    textData: {
      color: 'black',
    },
    buttonText: {
      color: 'black',
    },
    removeButton: {
      backgroundColor: '#ffcc00',
    },
  });
};

export const PaymentView = (_props: PaymentViewProps) => {
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
  const [response, setResponse] = useState<unknown>('');
  const styles = createStyles({ connected });

  const textStyle = {
    color: colors.text.default,
    margin: 10,
    fontSize: 16,
  };

  return (
    <View style={{ margin: 10, marginTop: 50, borderWidth: 2, padding: 5,  }}>

    <PaypalCheckout />

    </View>
  );
};
