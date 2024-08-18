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
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { TouchableWebElement } from '@ui-kitten/components/devsupport';
import PropTypes from 'prop-types';
import { useSDK } from '@metamask/sdk-react';
//import Donationbar from './Donationbar';
//import AccountPopover from './AccountPopover';
import { LanguagePopover2 } from './LanguagePopover2';
import { IconAnimationRegistry } from '@ui-kitten/components/ui/icon/iconAnimation';

const MetamaskConnectedIcon = (props): React.ReactElement => (
  <Avatar style={avtstyles.avatar} size='small' source={require('../../public/static/icons/MetaMask_Fox_connected.png')} />
);

const MetamaskNotConnectedIcon = (props): React.ReactElement => (
  <Avatar style={avtstyles.avatar} size='small' source={require('../../public/static/icons/MetaMask_Fox_notconnected.png')} />
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

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [titleTop, setTitleTop] = useState<string>("");
  const [subTitleTop, setSubTitleTop] = useState<string>("Not connected to any blockchain");
  const [currentChainName, setCurrentChainName] = useState<string>("UNKNOWN");

  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  };

  /*
  const renderMenuAction = (): TouchableWebElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={toggleMenu}
    />
  );
  */

  const renderRightActions = (): TouchableWebElement => (
    
    <>
      {//<TopNavigationAction icon={EditIcon} />
      }
      {//<NotificationsPopover langPack={langPack}/>
      }
      {//<AccountPopover langPack={langPack}/>
      }
      
      {/*
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={InfoIcon}
          title='About'
        />
        <MenuItem
          accessoryLeft={LogoutIcon}
          title='Logout'
        />
      </OverflowMenu>
      */}
      
      <LanguagePopover2 onChangeLang={onChangeLang}/>

    </>
  );

  const renderRightActions2 = (): React.ReactElement => (
    <>
      {connected ? (
        <>
          <Button
            style={avtstyles.avatar}
            appearance='ghost'
            status='danger'
            onPress={onAddChain}
            accessoryLeft={MetamaskConnectedIcon}
          />
  
        </>
      ) : (
        <> 
          <Button
            style={avtstyles.avatar}
            appearance='ghost'
            status='danger'
            onPress={onConnect}
            accessoryLeft={MetamaskNotConnectedIcon}
          />
        </>
      )}
      

    </>
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
        style={styles.topNav}
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
      
      <Divider />
      <TopNavigation
        alignment='center'
        title='Eva Application'
        subtitle={() => {
          {connected ? (
            "Connected to chain:"
          ) : (
            ""
          )}
        }}
        accessoryLeft={renderBackAction}
        accessoryRight={renderRightActions}
      />
    </Layout>
    
  );
};



const avtstyles = StyleSheet.create({
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
});

const styles = StyleSheet.create({
  topNav: {
    bgcolor: 'white',
  },
  container: {
  },
});