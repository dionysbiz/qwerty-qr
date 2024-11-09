// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    ...require('node-libs-expo'),
    crypto: require.resolve('crypto-browserify'),
};

config.resolver.unstable_enablePackageExports= true,

module.exports = config;