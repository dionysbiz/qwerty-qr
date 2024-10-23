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