import React,{ useState } from 'react';
import {
  Avatar,
  AnimationConfig,
  Button,
  Divider,
  Icon,
  IconElement,
  Layout,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  StyleService
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { TouchableWebElement } from '@ui-kitten/components/devsupport';
import PropTypes from 'prop-types';
import { useSDK } from '@metamask/sdk-react';
//import Donationbar from './Donationbar';
//import AccountPopover from './AccountPopover';
import { LanguagePopover2 } from './LanguagePopover2';
import { MetamaskConnectLogo } from './MetamaskConnectLogo';
import { IconAnimationRegistry } from '@ui-kitten/components/ui/icon/iconAnimation';



export type Props = {
  onOpenSidebar: any,
  onConnect: any,
  onAddChain: any,
  onChangeLang: any,
  langPack: any
};

export const TopNavbar: React.FC<Props> = ({onOpenSidebar, onConnect, onAddChain, onChangeLang, langPack}): React.ReactElement => {
  
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

  const MetamaskConnectedIcon = (props): React.ReactElement => (
    <Avatar 
      style={iconstyles.avatar} 
      size='small' 
      source={require('../../public/static/icons/MetaMask_Fox_connected.png')} />
  );
  
  const MetamaskNotConnectedIcon = (props): React.ReactElement => (
    <Avatar 
      style={iconstyles.avatar} 
      size='small' 
      source={require('../../public/static/icons/MetaMask_Fox_notconnected.png')} />
  );
  
  const BackIcon = (props): IconElement => (
    <Icon
      {...props}
      name='arrow-back'
    />
  );
  
  const EditIcon = (props): IconElement => (
    <Icon
      {...props}
      name='edit'
    />
  );
  
  const MenuIcon = (props): IconElement => (
    <Icon
      {...props}
      name='more-vertical'
    />
  );
  
  const InfoIcon = (props): IconElement => (
    <Icon
      {...props}
      name='info'
    />
  );
  
  const LogoutIcon = (props): IconElement => (
    <Icon
      {...props}
      name='log-out'
    />
  );

  const styles = useStyleSheet(StyleService.create({
    topNav: {
      //flex: 1,
      backgroundColor: 'color-warning-400', 
      //height: 150,
      maxHeight: 20,
      justifyContent: 'space-between',
    },
    topNav2: {
    },
    container: {
    },
  }));
  const iconstyles = useStyleSheet(StyleService.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: 5,
    },
    avatar: {
      margin: 2,
      width: 24,
      height: 24,
      bgcolor: 'currentColor',
    },
  }));


  const [menuVisible, setMenuVisible] = React.useState(false);
  const [titleTop, setTitleTop] = useState<string>("");
  const [subTitleTop, setSubTitleTop] = useState<string>("Not connected to any blockchain");
  const [currentChainName, setCurrentChainName] = useState<string>("UNKNOWN");

  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  };

  const renderRightActions = (): TouchableWebElement => (
    
    <>
      
      <LanguagePopover2 onChangeLang={onChangeLang}/>

    </>
  );

  const renderRightActions2 = (): React.ReactElement => (
    <MetamaskConnectLogo onConnect={onConnect} onAddChain={onAddChain} />
  );

  const renderBackAction = (): TouchableWebElement => (
    
    <TopNavigationAction icon={BackIcon} />
    
  );

  const showChainName = (chainId): string => {
    let name
    switch (chainId) {
      case '0x1':
      name = 'Ethereum Mainnet';
      break;
      case '0x3':
        name = ('Ropsten Testnet');
      break;
      case '0x4':
        name = ('Rinkeby Testnet');
      break;
      case '0x5':
        name = ('Goerli Testnet');
      case '0x89':
        name = ('Polygon');
      break;
      case '0xa4b1':
        name = ('Arbitrum');
      break;
      case '0xa':
        name = ('OP Mainnet');
      break;
      case '0x7a69':
        name = 'Hardhat Network';
      break;
      default:
        name = ('UNKNOWN');
    }
    return name
  };


  return (
    
    <Layout
      style={styles.container}
      level='1'
    >
      <TopNavigation
        //style={[styles.topNav, { backgroundColor: theme['color-primary-default'] }]}
        style={[styles.topNav,]}
        alignment='center'
        title={
          connected ? (
            ("Connected to: "+ showChainName(chainId))
          ) : (
            ""
          )}
        subtitle={
          connected ? (
            account
          ) : (
            "Not connected to any blockchain"
          )}
        accessoryRight={renderRightActions2}
      />
    </Layout>
    
  );
};