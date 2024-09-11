This is a demo React Native app connecting using Metamask SDK 

# How to Run
```
yarn install
npx expo prebuild
npx expo run:android
```

# Ref
https://docs.metamask.io/wallet/how-to/use-sdk/javascript/react-native/

To set up from the begining

# Remarks for Braintree
Please notes that the following files in node_module has been modified:
node_modules/braintree-web/lib/is-verified-domain.js
node_modules/braintree-web/client/client.js line106 response.configUrl=configUrl
node_modules/braintree-web/client/client.js