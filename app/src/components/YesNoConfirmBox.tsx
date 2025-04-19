import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

export const PopoutQuestionBox = ({ amount, fiatCurrency, airdropReceiverAddr, onConfirm, onCancel }: { amount:string, fiatCurrency:string, airdropReceiverAddr:string, onConfirm: () => void; onCancel: () => void }) => {
  const [visible, setVisible] = useState(true);

  const handleYes = () => {
    setVisible(false);
    onConfirm();
  };

  const handleNo = () => {
    setVisible(false);
    onCancel();
  };

  return (
    <>
      
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.message}>Crypto will be sent to your wallet address:</Text>
            <Text style={styles.message}>{airdropReceiverAddr}</Text>
            <Text style={styles.message}>Are you sure to pay {amount} in {fiatCurrency} with crediit card?</Text>
            <View style={styles.buttonContainer}>
              <Button title="Yes, Confirm" onPress={handleYes} />
              <Button title="Cancel" onPress={handleNo} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  box: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});