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
import { NavigationIndependentTree } from '@react-navigation/native';
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
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Spinner } from '@ui-kitten/components';


import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";

import { IListUser, IListUserType, UserSettingsSchema} from './src/realm/UserSettings'

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
  const [currentAccount, setCurrentAccount] = useState("")
  const [currentConnected, setCurrentConnected] = useState(false)
  const [permission, requestPermission] = useCameraPermissions();
  const [userSettings, setUserSettings] = useState({});
  


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

  useEffect(() => {
    //const realm = new Realm({ schema: [OfflineQRItemSchema] });
    console.log("useEffect load user setting")
    setTimeout(function (){loadUserSettings()}, 2000)
    
    // Cleanup function to close Realm
    /*
    return () => {
      if (realm && !realm.isClosed) {
        realm.close();
      }
    };
    */
  }, [])

  const createUpdateUserSettings = (
    id: string,
    userName: string,
    deliverAddress: string,
    langPref: string,
  ) => {
    let realm = new Realm({schema: [UserSettingsSchema]});
    
    console.log("User to be created/update")
    console.log("id",id)
    console.log("userName",userName)
    console.log("deliverAddress",deliverAddress)
    console.log("langPref",langPref)

    // Force id = 1
    if (id==="") {
      realm.write(() => {
        let item = realm.create('UserSettings', {
          id: '1',
          name:  userName,
          deliverAddress: deliverAddress,
          langPref: langPref,
          //dateCreate: dateCreate,
          //dateUpdate: dateUpdate,
        });
      });
    } else {
      const objectToUpdate = realm.objectForPrimaryKey("UserSettings", '1');
      realm.write(() => {
        console.log(userName)
        objectToUpdate.name= userName
        objectToUpdate.deliverAddress= deliverAddress
        objectToUpdate.langPref= langPref
        //objectToUpdate.dateCreate= dateCreate
        //objectToUpdate.dateUpdate= dateUpdate
      });
    }
    
    //write to local Database
    
    loadUserSettings()
  }

  const loadUserSettings = () => {
    console.log("loadUserSettings");
    //let realm = new Realm({schema: [OfflineQRItemSchema]});
    let data = [{name: 'FirstItemname', deliverAddress: 'DescripTioN', langPref: 'en'}]
    data=[]

    Realm.open({schema: [UserSettingsSchema]})
    .then(realm => {
      console.log("open relm");
      // ... use the realm instance to read and modify data
      let realmUserList = realm.objects('UserSettings')
      console.log(realmUserList);
      for (let p of realmUserList) {
        let user:IListUser = {
          id: String(p.id), 
          name: String(p.name), 
          deliverAddress: String(p.deliverAddress),
          langPref: String(p.langPref),
          
        }
        data.push(user)
      }
      
      
      if (!realm.isClosed) {
        realm.close();
        console.log("Realm instance has been closed.");
      }
    }).then(() => {
      console.log("Check user settings");
      console.log(data[0]);
      console.log("id",data[0].id)
      console.log("userName",data[0].name)
      console.log("deliverAddress",data[0].deliverAddress)
      console.log("langPref",data[0].langPref)

      //setUserList(data)
      setUserSettings(data[0])
      handleLangChange(data[0].langPref)
    })

    
    
    //realm.close();
    //console.log("Realm Close at loadUserSettings")
  }
  
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
      height: (Platform.OS === 'ios') ? 18 : 25, //this is just to test if the platform is iOS to give it a height of 18, else, no height (Android apps have their own status bar)
      //backgroundColor: "grey",
      //backgroundColor: "transparent", // Set to transparent

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
          //<>{/*<Fontisto name="money-symbol" size={25} color={routeName === selectedTab ? 'black' : 'gray'} /> */}</>
          return (
            <FontAwesomeIcon name="comments-dollar" size={25} color={routeName === selectedTab ? 'black' : 'gray'} />
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
          <Stack.Screen 
            name='BuyCryptoScreen' 
            //component={() =><BuyCryptoScreen handleLangChange={handleLangChange} langPack={langPack}/>} 
            component={ BuyCryptoScreen }
            initialParams={{
              handleLangChange: {handleLangChange},
              langPack: {langPack},
              walletAddr: currentAccount,
              currentChainId: currentChainId
            }}
          />
          <Stack.Screen name='PaymentScreen' component={PaymentScreen}/>
        </Stack.Navigator>
    )
    //navigation={MyStack}
  }

  const ShopManagementStack = () => {
    const Stack = createNativeStackNavigator();
    //console.debug("checkLangPack",JSON.stringify(langPack))
    //<Stack.Screen name='ShopManagementScreen' component={() => <ShopManagementScreen langPack={langPack} walletAddr={account} currentChainId={currentChainId}/>}/>
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='ShopManagementScreen' 
            children={() => (
              <ShopManagementScreen
                langPack={langPack} // Pass langPack directly as a prop
                walletAddr={currentAccount}
                currentChainId={currentChainId}
              />
            )}
          />
          <Stack.Screen name='OnlineShopItemScreen' component={OnlineShopItemScreen}/>
          <Stack.Screen name='OfflineQRMenuScreen' component={OfflineQRMenuScreen}/>
          <Stack.Screen name='ReceivedOrdersScreen' component={ReceivedOrdersScreen}/>

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
      console.log("await sdk?.connect()")
      const accounts = (await sdk?.connect()) as string[];
      console.log('accounts', accounts);
      setCurrentChainId(chainId)
      setCurrentAccount(account)
      setCurrentConnected(true)
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const addChain = async (chain:any) => {
    try {
      setResponse('');
      console.log("call addChain going to switch to:")
      console.log("chain",chain)
      console.log("chainId",chain.chainId)
      console.log("chainName",chain.chainName)
      console.log("blockExplorer",chain.blockExplorerUrls)
      console.log("nativeCurrency",chain.nativeCurrency)
      console.log("rpcUrls",chain.rpcUrls)
      if ((chain.chainId==='0x1') || ( chain.chainId==='0x7a69' )) {
        setResponse('');
        console.log("chainID is found directly call wallet_switchEthereumChain")
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
        setCurrentChainId(chain.chainId)
        setCurrentAccount(account)
        setCurrentConnected(true)
      } else {
        console.log("chainID NOT found need to add the it to METAMASK using wallet_addEthereumChain")
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
        setCurrentChainId(chain.chainId)
        setCurrentAccount(account)
        setCurrentConnected(true)
      }
      
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  if (!sdk) {
    return (
      <View style={styles.loading}>
        <Spinner />
        <Text>{langPack.loading_msg}</Text>
      </View>
    );
  } else {
    //sdk?.terminate();
  } 
  
  return( 
    <>
    {/*
    <View style={[styles.statusBarBackground || {}]}></View>
    */}
    <StatusBar
      translucent
      backgroundColor="steelblue"
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    />
      
    <SafeAreaView style={{ flex: 1 }}>
         
      
      <TopNavbar 
        onOpenSidebar={() => setNavbarOpen(true)}
        onConnect={connectWithMetamask}
        onAddChain={addChain}
        onChangeLang={handleLangChange}
        userSettings={userSettings}
        langPack={langPack}
        useSDKchainID={currentChainId}
        useSDKConnected={currentConnected}
        useSDKAccount={currentAccount} 
        saveUserSettingsHandler={createUpdateUserSettings}      
      />
      <NavigationIndependentTree>


        <CurvedBottomBarExpo.Navigator
          type="DOWN"
          screenOptions={{headerShown: false}}
          style={stylesBottomBar.bottomBar}
          shadowStyle={stylesBottomBar.shawdow}
          height={55}
          circleWidth={50}
          bgColor="white"
          //initialRouteName="title1"
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
                    params: { walletAddr: currentAccount, langPack: JSON.stringify(langPack) }
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
        
      </NavigationIndependentTree>
      
      
    </SafeAreaView>
    </>
  )
  //<Screen name='Home' component={HomeScreen}/>
  //<Screen name='DemoScreen' component={DemoScreen}/>
};
