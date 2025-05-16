import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IndexPath, Card, Text, Layout, Select, SelectItem, MenuItem, Input, OverflowMenu, Modal, List, ListItem  } from '@ui-kitten/components';
import { languagesList } from '../translate';

import PropTypes from 'prop-types';

export type Props = {
  useInfo: any,
  saveUserSettingsHandler: any ,
  langPack: any,
};

export const UserSettingEditCard = ({ userSettings, saveUserSettingsHandler, langPack }): React.ReactElement => {
  // ---------------State variables--------------- 
  const [userId, setUserId] = useState(userSettings.id || '');
  const [userName, setUserName] = useState(userSettings.name || '');
  const [userDeliverAddress, setUserDeliverAddress] = useState(userSettings.deliverAddress || '');
  const [userLangPref, setUserLangPref] = useState(userSettings.langPref || '');
  const [userDateCreate, setUserDateCreate] = useState(userSettings.dateCreate || '');

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  // ---------------Visual Items--------------- 

  const selectLanguage = (languageCode: string) => {
    console.log(`Selected language: ${languageCode}`);
    setLanguageModalVisible(false);
    // Add logic to update the app's language here
    setUserLangPref(languageCode);
  };

  const renderLanguageItem = ({ item }) => (
    <ListItem
      title={item.name}
      onPress={() => selectLanguage(item.code)}
    />
  );

  const LanguageList = (props: ViewProps): React.ReactElement => (
    <Modal
      visible={isLanguageModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View style={{ width: 250, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <Card disabled={true} style={{ width: '92%', padding: 20 }}>
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

  })

  const Header = (props: ViewProps): React.ReactElement => (
    <View {...props}>
      
      <Text category='h6'>
        {langPack.userSettingEditCard_topMsg}
      </Text>
      <Text category='h6'>
        {langPack.userSettingEditCard_topMsg2}
      </Text>
      <Text category='h6'>
        {langPack.userSettingEditCard_topMsg3}
      </Text>
      <Text category='h6'>
        {langPack.userSettingEditCard_topMsg4}
      </Text>
    </View>
  );

  return (
    <>
    <Layout style={styles.modalcontainer}>
      
      <Card style={styles.container} disabled={true} header={Header}>

        <Input style={styles.inputbox}
          placeholder={langPack.userSettingEditCard_name}
          value={userName}
          onChangeText={nextValue => {
            setUserName(nextValue)
          }}
        />
        <Input style={styles.inputbox}
          textStyle={styles.inputTextStyle}
          placeholder={langPack.userSettingEditCard_deilveryAddress}
          value={userDeliverAddress}
          multiline={true}
          onChangeText={nextValue => {
            setUserDeliverAddress(nextValue)
          }}
        />
        
        <Button style={evastyles.button} onPress={() => setLanguageModalVisible(true)}>
          {langPack.button_language}
        </Button>

        
        
        
        <Button
          //disabled={saveBtnDisable}
          onPress={() => {
          let newId= ''
          let newCreateDate:Date=new Date()
          let newUpdateDate:Date=new Date()

          if (userId === '' || userId === undefined) {
            //newId=String(hashCode(userName))
            newId=""
            setUserId(newId)
            newCreateDate=new Date()
            newUpdateDate=new Date()
          } else {
            newId="1"
            setUserId(newId)
            newCreateDate=userDateCreate
            newUpdateDate=new Date()
          }

          saveUserSettingsHandler(
            
            newId,
            userName,
            userDeliverAddress,
            userLangPref,
            
          )
        }}>
          {langPack.userSettingEditCard_savebutton}
        </Button>
      </Card>
    </Layout>
    <LanguageList/>
    </>
  )
};

const evastyles = StyleSheet.create({
  button: {
    margin: 2,
    backgroundColor: 'color-info-transparent-600', 
  },
});

const styles = StyleSheet.create({
  modalcontainer: {
    width: 350,
    //flex: 1,
    //flexDirection: 'column',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  container: {
    width: '100%' , 
    flexDirection: 'column',
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