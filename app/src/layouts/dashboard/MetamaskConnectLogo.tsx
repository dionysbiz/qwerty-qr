import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import React from 'react';
import { useSDK } from '@metamask/sdk-react';

import {
  Avatar,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Button, Icon, IconElement, IndexPath, Layout, Spinner,
  useStyleSheet,
  StyleService
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

// components
//import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

const CHAINLIST = [
  {
    id: 0,
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.payload.de'],
  },
  {
    id: 1,
    chainId: '0x89',
    chainName: 'Polygon',
    blockExplorerUrls: ['https://polygonscan.com'],
    nativeCurrency: { symbol: 'POL', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com/'],
  },
  {
    id: 2,
    chainId: '0xa4b1',
    chainName: 'Arbitrum',
    blockExplorerUrls: ['https://arbiscan.io/'],
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arbitrum.llamarpc.com/'],
  },
  {
    id: 3,
    chainId: '0xa',
    chainName: 'OP Mainnet',
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://optimism-rpc.publicnode.com'],
  },
  {
    id: 4,
    chainId: '0x7a69',
    chainName: 'Hardhat-dev',
    blockExplorerUrls: ['https://etherscan.io/'],
    nativeCurrency: { symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://hardhatnetwork-dev.dionys.xyz'],
  }
]

const chainArr = Array.from(CHAINLIST)

const LANGS = [
  {
    value: 'en',
    label: 'Etherum',
    icon: '/static/icons/ic_flag_en.svg',
  },
  {
    value: 'zhHK',
    label: 'Polygon',
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



export type Props = {
  onConnect: any,
  onAddChain: any,
  currentChainId: string,
};

const btnstyle = StyleSheet.create({
  container: {
    verticalAlign: 'middle'
  }
});



export const MetamaskConnectLogo: React.FC<Props> = ({ onConnect, onAddChain, currentChainId }): React.ReactElement => {
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
  
  // ---------------State variables--------------- 

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
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
  const iconstyles = useStyleSheet(StyleService.create({
    container: {
      //flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      
    },
    avatar: {
      flexDirection: 'row',
      //alignSelf: 'flex-end',
      //justifyContent: 'space-around',
      //alignItems: 'flex-start',
      //flex:1,
      width: 36,
      //height: 24,
      //bgcolor: 'currentColor',
    },
  }));

  // ---------------Visual Items--------------- 

  const MetamaskConnectedIcon = (props): React.ReactElement => (
    <Avatar 
      //style={iconstyles.avatar} 
      size='small' 
      source={require('../../public/static/icons/MetaMask_Fox_connected.png')} />
  );
  
  const MetamaskNotConnectedIcon = (props): React.ReactElement => (
    <Avatar 
      //style={iconstyles.avatar} 
      size='small' 
      source={require('../../public/static/icons/MetaMask_Fox_notconnected.png')} />
  );

  console.debug('currentChainId',currentChainId)
  if (currentChainId==='' ||  !currentChainId || currentChainId==null ) {
    console.debug('currentChainId is null',currentChainId)
  }
  const MenuIcon = (props): IconElement => (
    <>
        {(currentChainId)? (
          <>
            <Button
              appearance='ghost'
              status='danger'
              onPress={toggleChainList}
              accessoryLeft={MetamaskConnectedIcon}
            />
    
          </>
        ) : (
          <> 
            <Button
              appearance='ghost'
              status='danger'
              onPress={onConnect}
              accessoryLeft={MetamaskNotConnectedIcon}
            />
          </>
        )}
      </>
  );


  // ---------------onPress Handler--------------- 
  
  const handleOpen = () => {
    setOpen(true);
  };

  
  const handleChainSelect = (index) => {
    console.log("handleChainSelect")
    console.log("index",index)
    console.log("chainArr[index.row]",chainArr[index.row])
    changeChainIndex(index.row)
    onAddChain(chainArr[index.row])
    toggleChainList()
    setOpen(false);
  };
  

  const toggleChainList = (): void => {
    setChainListVisible(!chainListVisible);
  };
  
  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction
      style={iconstyles.avatar}
      icon={MenuIcon}
      onPress={toggleChainList}
    />
  );

  const changeChainIndex = (chainId): string => {
    let name
    let idx = "0"
    switch (chainId) {
      case '0x1':
      name = 'Ethereum Mainnet';
      idx = "0"
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
        idx = "1"
      break;
      case '0xa4b1':
        name = ('Arbitrum');
        idx = "2"
      break;
      case '0xa':
        name = ('OP Mainnet');
        idx = "3"
      break;
      case '0x7a69':
        name = ('Hardhat Network');
        idx = "4"
      break;
      default:
        name = ('UNKNOWN');
        idx = "0"
    }
    setSelectedIndex(idx)
    return idx
  };
  

  useEffect(() => {
    /*
    if (Cookies.get('langIndex')) {
      const i = Cookies.get('langIndex')
      setCurrentLang(i)
      onChangeLang(LANGS[i].value)
    }
    */
    console.log("MetamaskConnectedLogo useEffect chainId: ", currentChainId)
    changeChainIndex(currentChainId)
  })
  
  //onClick={() => handleClose(option.value, index)}

  return (
    
      <OverflowMenu
        anchor={renderMenuAction}
        visible={chainListVisible}
        onBackdropPress={toggleChainList}
        selectedIndex={selectedIndex}
        onSelect={index => handleChainSelect(index)}
      >
        {CHAINLIST.map((option, index) => (
          <MenuItem 
          key={option.chainId} 
          title={option.chainName}   
          //selected={option.value === LANGS[currentLang].value}
          />
        ))}
      </OverflowMenu>
    
  );
}
