// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    ...require('node-libs-expo'),
    ...require('node-libs-react-native'),
    //...require('react-native-tcp-socket'),
    crypto: require.resolve('crypto-browserify'),
    //net: require.resolve('node-libs-react-native/mock/net'),
    net: require.resolve('react-native-tcp-socket'),
    tls: require.resolve('react-native-tcp-socket'),
    //tls: require.resolve('node-libs-react-native/mock/tls'),
    // Try put this to node modules
    /*
    import TcpSockets from 'react-native-tcp-socket';

    export const Server = TcpSockets.TLSServer;
    export const TLSSocket = TcpSockets.TLSSocket;
    export const connect = TcpSockets.connectTLS;
    export const createServer = TcpSockets.createTLSServer;
    */
};

config.resolver.unstable_enablePackageExports= true,

module.exports = config;