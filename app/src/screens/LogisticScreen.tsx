import React, { useState } from 'react';
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

export function LogisticScreen({}): JSX.Element {
  // ---------------State variables--------------- 

  // ---------------Style Sheets---------------
  const styles = StyleSheet.create({
    logistic: {
      flex: 1,
      backgroundColor: '#BFEFFF',
    },
  });
  return (
  <>
    <View style={styles.logistic}></View>
  </>
  )
}