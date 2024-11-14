import React from 'react';
import { useRef, useState, useEffect } from 'react';
import {Alert,
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  Platform,
  View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { zhHK, en } from './src/translate';
import { useSDK } from '@metamask/sdk-react';

import { BuyCryptoScreen } from './src/screens/BuyCryptoScreen';
import { MetamaskSDKDemoScreen } from './src/screens/MetamaskSDKDemoScreen';
import { LogisticScreen } from './src/screens/LogisticScreen';
import { ShopManagementScreen } from './src/screens/ShopManagementScreen';
import { OnlineShopItemScreen } from './src/screens/OnlineShopItemScreen';
import { OfflineQRMenuScreen } from './src/screens/OfflineQRMenuScreen';
import { ReceivedOrdersScreen } from './src/screens/ReceivedOrdersScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
//import { CameraScreen } from './src/screens/CameraScreen';

import { TopNavbar } from './src/layouts/dashboard/TopNavbar';

//import { DetailsScreen } from './details.component';
//Bottom Bar related
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Spinner } from '@ui-kitten/components';


import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";



import { Colors } from 'react-native/Libraries/NewAppScreen';

const { Navigator, Screen } = createStackNavigator();
/*
export type Props = {
  navigation: any,
};
*/
export const AppNavigator = (): JSX.Element => {
  // ---------------State variables--------------- 
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [langPack, setLangPack] = useState(en)
  const [response, setResponse] = useState<unknown>('');
  const [currentChainId, setCurrentChainId] = useState("")
  const [permission, requestPermission] = useCameraPermissions();


  const isPermissionGranted = Boolean(permission?.granted);
  

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
  
  // ---------------Style Sheets---------------
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  const stylesBottomBar = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    shawdow: {
      shadowColor: '#DDDDDD',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
    },
    button: {
      flex: 1,
      justifyContent: 'center',
    },
    bottomBar: {},
    btnCircleUp: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E8E8E8',
      bottom: 30,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 1,
    },
    imgCircle: {
      width: 30,
      height: 30,
      tintColor: 'gray',
    },
    tabbarItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    img: {
      width: 30,
      height: 30,
    },
    screen1: {
      flex: 1,
      height:100,
      backgroundColor: '#BFEFFF',
    },
    screen2: {
      flex: 1,
      backgroundColor: '#FFEBCD',
    },

  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "black",
      justifyContent: "space-around",
      paddingVertical: 80,
    },
    title: {
      color: "white",
      fontSize: 40,
    },
    buttonStyle: {
      color: "#0E7AFE",
      fontSize: 20,
      textAlign: "center",
    },
    statusBarBackground: {
      height: (Platform.OS === 'ios') ? 18 : 30, //this is just to test if the platform is iOS to give it a height of 18, else, no height (Android apps have their own status bar)
      backgroundColor: "grey",
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // ---------------Visual Items--------------- 
  const isDarkMode = useColorScheme() === 'dark';

  // BottomBar 
  const _renderIcon = (routeName: any, selectedTab: any) => {
    let icon = '';

    switch (routeName) {
      case 'home':
        return (
          <Ionicons
            name="home-outline"
            size={25}
            color={routeName === selectedTab ? 'black' : 'gray'}
          />
        );
        break;
      case 'metamasksdkdemo':
          icon = 'globe-outline';
          return (
            <Fontisto name="money-symbol" size={25} color={routeName === selectedTab ? 'black' : 'gray'} />
          );
          break;
      case 'shop':
        //icon = 'podium-outline';
        return (
          <Entypo
            name="shop"
            size={25}
            color={routeName === selectedTab ? 'black' : 'gray'}
          />
        );
        break;
      case 'logistic':
        return (
          <FontAwesome5 name="shipping-fast" size={25} color={routeName === selectedTab ? 'black' : 'gray'} />
        );
        break;
    }
    
    return (
      <Ionicons
        name={icon}
        size={25}
        color={routeName === selectedTab ? 'black' : 'gray'}
      />
    );
    
  };
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={stylesBottomBar.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  

  // ---------------navigate function---------------

  

  const MyStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='BuyCryptoScreen' component={BuyCryptoScreen}/>
          <Stack.Screen name='PaymentScreen' component={PaymentScreen}/>
        </Stack.Navigator>
    )
    //navigation={MyStack}
  }

  const ShopManagementStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='ShopManagementScreen' component={ShopManagementScreen}/>
          <Stack.Screen name='OnlineShopItemScreen' component={() =><OnlineShopItemScreen/>}/>
          <Stack.Screen name='OfflineQRMenuScreen' component={() =><OfflineQRMenuScreen/>}/>
          <Stack.Screen name='ReceivedOrdersScreen' component={() =><ReceivedOrdersScreen/>}/>

        </Stack.Navigator>
    )
  }

  /*
  const CameraStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='CameraScreen' component={CameraScreen}/>
          

        </Stack.Navigator>
    )
  }
  */

  const askForPCameraPermission = () => {

    if (!permission) {
      // Camera permissions are still loading.
      console.log("Camera permissions are still loading.")
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      requestPermission()

    } 
  }
  

  // ---------------onPress Handler---------------
  const handleLangChange = (lang: string) => {
    switch (lang) {
      case 'zhHK':
        setLangPack(zhHK);
        break;
      case 'en':
        setLangPack(en);
        break;
      default:
        setLangPack(en);
    }
  };

  const connectWithMetamask = async () => {
    try {
      const accounts = (await sdk?.connect()) as string[];
      console.log('accounts', accounts);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const addChain = async (chain:any) => {
    try {
      setResponse('');
      console.log("call addChain")
      console.log("chain",chain)
      console.log("chainId",chain.chainId)
      console.log("chainName",chain.chainName)
      console.log("blockExplorer",chain.blockExplorerUrls)
      console.log("nativeCurrency",chain.nativeCurrency)
      console.log("rpcUrls",chain.rpcUrls)
      if (chain.chainId==='0x1') {
        setResponse('');
        const result = await ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: chain.chainId,
            },
          ],
        });
        console.log('switchChain', result);
        setResponse(result);
      } else {
        const result = await ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chain.chainId,
              chainName: chain.chainName,
              blockExplorerUrls: chain.blockExplorerUrls,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls,
            },
          ],
        });
        console.log('addChain', result);
        setResponse(result);
      }
      
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  if (!sdk) {
    return (
      <View style={styles.loading}>
          <Spinner />
          <Text>Preparing for chicken..</Text>
        </View>
    );
  } else {
    //sdk?.terminate();
  } 

  
  
  return( 
    <>
    <View style={[styles.statusBarBackground || {}]}>
    </View>
      
    <SafeAreaView style={{ flex: 1 }}>
         
      
      <TopNavbar 
        onOpenSidebar={() => setNavbarOpen(true)} 
        onConnect={connectWithMetamask}
        onAddChain={addChain} 
        onChangeLang={handleLangChange} 
        langPack={langPack}
      />
      <NavigationContainer independent={true}>

        <CurvedBottomBarExpo.Navigator
          type="DOWN"
          screenOptions={{headerShown: false}}
          style={stylesBottomBar.bottomBar}
          shadowStyle={stylesBottomBar.shawdow}
          height={55}
          circleWidth={50}
          bgColor="white"
          initialRouteName="title1"
          borderTopLeftRight
          renderCircle={({ selectedTab, navigate }) => (
            <Animated.View style={stylesBottomBar.btnCircleUp}>
              { !permission ?
                <View />
                : !permission.granted ? 
                <>
                  <TouchableOpacity
                    style={stylesBottomBar.button}
                    onPress={() => askForPCameraPermission()}
                  >
                    <Ionicons name="qr-code-outline" size={25} color="grey" />
                  </TouchableOpacity>
                </>
                : 
                <>
                  <Link href={{
                    pathname: "/scanner",
                    params: { walletAddr: account }
                    }} asChild>
                    <Pressable disabled={!isPermissionGranted}>
                      <Ionicons name="qr-code-outline" size={25} color="grey" />
                    </Pressable>
                  </Link>
                </>
              }
              
            </Animated.View>
          )}
          tabBar={renderTabBar}
        >
        {/* 
        <CurvedBottomBarExpo.Screen
          name="home"
          position="LEFT" 
          component={ () => <MetamaskSDKDemoScreen /> }
        />
        */}
        <CurvedBottomBarExpo.Screen
          name="metamasksdkdemo"
          position="LEFT"
          component={ MyStack }
        />
        <CurvedBottomBarExpo.Screen
          name="shop"
          component={ ShopManagementStack }
          position="RIGHT"
        />
        {/* 
        <CurvedBottomBarExpo.Screen
          name="logistic"
          position="RIGHT"
          component={() => <LogisticScreen />}
        />
        */}
          
        </CurvedBottomBarExpo.Navigator>
        
      </NavigationContainer>
      
      
    </SafeAreaView>
    </>
  )
  //<Screen name='Home' component={HomeScreen}/>
  //<Screen name='DemoScreen' component={DemoScreen}/>
};
