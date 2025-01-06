This is a demo React Native app connecting using Metamask SDK 

# Update @ 22 Oct 2024

I think I should write some thing about this app for some body who needs to know more about this app and the whole project

## Main features
This app has 3 main purposes
- Let user to enter the credit card information to buy any ERC 20 coins
- Generate their own products QR code for token transfer
- A QR code reader for triggering ERC20 transaction through metamask

### Credit Card payment for ERC20
The app will show available ERC20s under corresponding chain. After the user enter their credit card info, it will sent to braintree for validation, followed with a transaction request.

[[Braintree process flow Documentations]](https://developer.paypal.com/braintree/docs/start/overview)

Accepted transaction request will be recorded in braintree waiting for settlement and then to AWS DynamoDB as a record.

The settled transaction will be scanned by the backend with regular basis and so the ERC20 will be sent out to users wallet.

### QR code for Item purchase
Shop owners can generate QR code for their products so that that customer can use the app's scanner to trigger a ERC20 transfer on blockchain.
After successful transaction, it will appear on the order pending list of the shop.

## Backend
The backend is host on local K8S. It is a combination of microservices implemented by Kotlin Spring boot, with the help of 
- Spring Cloud Data Flow (SCDF) as Feign Client
- Eureka Server as Registry of Backend Services
- ArgoCD for Continuos Delivery 

For more information, visit the github page of those projects provided below.

[Spring Cloud Dataflow Source Braintree (Private Git)](https://github.com/ram4444/scdfsourcebraintreerequest) \
[Braintree Server running in Eureka (Private Git)](https://github.com/ram4444/paypalbraintreeserver) \
[Spring Cloud Dataflow Processor Token Order (Private Git)](https://github.com/ram4444/scdfprocessortokenorderhandler)

## Future development
- Online shopping with orders handling and shipment arrangement
- Page for shipment provider to accepting request
- QR scanner for completing shipment and receive the serivice charge
- Search Engine for shops and goods
- Encrypted Private Key on QR code for triggering Transaction 

# How to Run
To set up from the begining
```
yarn install
npx expo prebuild
npx expo run:android
```
Dependency Requirement:
- java-17-openjdk
- expo
- Android Studio with SDK 33 or above

# How to Build
```
eas build -p android --profile preview
```
https://www.youtube.com/watch?v=pb6OvvSi8Qk

# Code Example (NOT WORK)
https://docs.metamask.io/wallet/connect/metamask-sdk/mobile/react-native/ \
https://github.com/MetaMask/metamask-sdk/tree/main/packages/examples/expo-demo

For both React Native and Expo example, it has not been updated for a year on the official git.

My first try to make this work on Expo is @ Aug 2024. The code example above,which Metamask-SDK updated to v0.28.4, is 90% similar to mine one. However when I try to update the package.json, the project no long works.

Ny just copying the code example and run, it shows SDKConfigProvider cannot be resolved.

# Ref
https://docs.metamask.io/wallet/reference/json-rpc-methods/ 


# Remarks for Braintree
Please notes that the following files in node_module has been modified:
node_modules/braintree-web/lib/is-verified-domain.js
node_modules/braintree-web/client/client.js line106 response.configUrl=configUrl
node_modules/braintree-web/client/client.js

---
Generated from Expo template

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
