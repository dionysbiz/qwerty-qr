import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import React from 'react';
import {
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Button, Icon, IconElement, IndexPath, Layout, Popover, Text, Modal
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { UserSettingEditCard } from '../../components/UserSettingEditCard';

// components
//import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

const MENU = [
  {
    value: 'setting',
    label: 'Setting',
    icon: '/static/icons/ic_flag_en.svg',
  },
  {
    value: 'about',
    label: 'About Us',
    icon: '/static/icons/ic_flag_hk.svg',
  },
];

// ----------------------------------------------------------------------

const MenuIcon = (props): IconElement => (
  <Icon
    {...props}
    name='more-vertical'
  />
);

export type Props = {
  userSettings: any,
  saveUserSettingsHandler: any,
  onChangeLang: any,
  langPack: any,
};



export const MenuPopover: React.FC<Props> = ({ userSettings, saveUserSettingsHandler, onChangeLang, langPack }): React.ReactElement => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [menuVisible, setMenuVisible] = React.useState(false);
  

  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
    console.log("userSettings",userSettings)
  };
  
  
  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={toggleMenu}
    />
  );

  const styles = StyleSheet.create({
    content: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: 4,
      paddingVertical: 8,
    },
    inputbox: {
      marginVertical: 2,
      width: '100%' ,
    },
    inputTextStyle: {
      minHeight: 64,
    },
  });
  

  useEffect(() => {

  });
  

  return (
    <>
      <Popover
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <Layout style={styles.content}>
          <UserSettingEditCard
            userSettings={userSettings}
            saveUserSettingsHandler={saveUserSettingsHandler}
            langPack={langPack}
          />
        </Layout>
      </Popover>
      
    </>
  );

  
}
