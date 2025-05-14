import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import React from 'react';
import {
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Button, Icon, IconElement, IndexPath, Layout, Spinner, Modal
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

// components
//import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg',
  },
  {
    value: 'zhHK',
    label: 'Trad. Chinese',
    icon: '/static/icons/ic_flag_hk.svg',
  },
  /*
  {
    value: 'cn',
    label: 'Simp. Chinese',
    icon: '/static/icons/ic_flag_cn.svg',
  },
  {
    value: 'jp',
    label: 'Japanese',
    icon: '/static/icons/ic_flag_jp.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/static/icons/ic_flag_de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/static/icons/ic_flag_fr.svg',
  },
  {
    value: 'sp',
    label: 'Spainish',
    icon: '/static/icons/ic_flag_sp.svg',
  },
  */
];

// ----------------------------------------------------------------------

const MenuIcon = (props): IconElement => (
  <Icon
    {...props}
    name='more-vertical'
  />
);

export type Props = {
  onChangeLang: any,
};

const btnstyle = StyleSheet.create({
  container: {
    verticalAlign: 'middle'
  }
});



export const LanguagePopover2: React.FC<Props> = ({ onChangeLang }): React.ReactElement => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [languageMenuVisible, setLanguageMenuVisible] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  
  const handleLangSelect = (index) => {
    //console.log("index")
    //console.log(index)
    setSelectedIndex(index)
    onChangeLang(index.row)
    toggleLanguageMenu()
    //if (index !== 'backdropClick') {
      //onChangeLang(lang)
      //setCurrentLang(index)
      //Cookies.set('langIndex',index, { expires: 365 });
    //}
    setOpen(false);
    
  };
  

  const toggleLanguageMenu = (): void => {
    setLanguageMenuVisible(!languageMenuVisible);
  };
  
  
  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={toggleLanguageMenu}
    />
  );
  

  useEffect(() => {
    /*
    if (Cookies.get('langIndex')) {
      const i = Cookies.get('langIndex')
      setCurrentLang(i)
      onChangeLang(LANGS[i].value)
    }
    */
  })
  
  //onClick={() => handleClose(option.value, index)}

  return (
    <>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={languageMenuVisible}
        onBackdropPress={toggleLanguageMenu}
        selectedIndex={selectedIndex}
        onSelect={index => handleLangSelect(index)}
      >
        {LANGS.map((option, index) => (
          <MenuItem 
          key={option.value} 
          title={option.label}   
          //selected={option.value === LANGS[currentLang].value}
          />
        ))}
      </OverflowMenu>
      
    </>
      
    
  );
}
