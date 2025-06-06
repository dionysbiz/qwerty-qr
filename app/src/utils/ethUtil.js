import Web3 from 'web3';
//import axios from 'axios';
import { urls } from '../properties/urls';

const { abierc777 } = require('../abi/ERC777.json');
const abierc20 = require('../abi/TTK.json');
const { localChainList } = require('../properties/localChainList');

const App = new Web3()
let web3

export async function checkWalletExist() {
    
  let walletFound = false;

  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      
      // Depricatd soon 
      // await window.ethereum.enable();
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      walletFound=true
      console.log('Wallet found')
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  } else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
    walletFound=true
    console.log('Wallet found [Legacy]')
    const acct = await App.web3Provider.request({
      "method": "eth_requestAccounts"
     });
     console.log(acct)
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    console.error('web3 was undefined');
    walletFound=false
  }
  web3 = new Web3(App.web3Provider);
  
  // legacy 
  /*
  if (typeof web3 !== 'undefined') {
    console.log('Web3 found');
    window.web3 = new Web3(window.web3.currentProvider);
    // web3.eth.defaultAccount = web3.eth.accounts[0];
    walletFound=true
  } else {
    console.error('web3 was undefined');
    walletFound=false
  }
  */

  return walletFound;
  
}

//checkWalletExist()
/*
export function getChainlistJSON() {
  
  return axios({
    method: 'get',
    url: urls.chainlist,
    responseType: 'json',
    // crossDomain: true,
    // headers: { 'Access-Control-Allow-Origin': '*' }
  })
    .then((response) => {
    console.log(`HTTP call to ${urls.chainlist} is done`);
    console.log(response);
    return response;
  })
      
}
  */

export async function getEtherscanAbi(chainId, contractAddr) {
  // Query the abi by the follow url as sample
  // const response = await fetch('https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=0xC1dcBB3E385Ef67f2173A375F63f5F4361C4d2f9&apikey=YourApiKeyToken');
  
  let apiURL;
  switch (chainId) {
    
    case '0x1':
      apiURL = urls.etherscan_mainnet;
      break;
    case 'Rinkeby':
      apiURL = urls.etherscan_rinkeby;
      break;
    default:
      apiURL = urls.etherscan_rinkeby;
      return 0
  }

  const responseEtherscanContract = await fetch(`${apiURL+contractAddr}&apikey=5AECWF2IJ7TIYABD8DVZ6FQR2R15MPRUCV`)
  const json = await responseEtherscanContract.json();

  //console.log(json)

  return json
    
}


/*
export async function triggerTransaction(chainName, contractAddr, paymentTokenName, fromAddr, toAddr, amount, onSuccess, onFail) {
  let abiEtherscan;
  let contract;
  let walletExist=false;
  let targetChainId=''

  checkWalletExist()

  const chainListJSON = await getChainlistJSON().then((response) => {
    if (response.status === 200) {
      // return response.data
      console.log(localChainList)
      return localChainList
    } 
      return localChainList
    
  }
  )

  await chainListJSON.forEach((item)=>{
    if (chainName===item.name){
      targetChainId = item.chainId
    }
  })
  // console.log(targetChainId)
  
  // Check wallet exists
  walletExist = await checkWalletExist;


  // Change the current network to target chain
  if (window.ethereum.networkVersion !== targetChainId) {
    console.log('read to change network')
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(targetChainId) }]
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Polygon Mainnet',
              chainId: web3.utils.toHex(targetChainId),
              // nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
              // rpcUrls: ['https://polygon-rpc.com/']
            }
          ]
        });
      }
    }
  }

  // Get the gas price
  web3.eth.getGasPrice().then(async (result) => {
    
    console.log('GasFee in Wei')
    console.log(result)

    let gasFee
    let unit

    // Unit Adjustment
    if (paymentTokenName.includes("Tether")) {
      unit='mwei'
    } else {
      unit='ether'
    }

    switch (chainName) {
    case 'Rinkeby':
      // gasFee = web3.utils.toHex(web3.utils.toWei('100', 'gwei'))
      gasFee = web3.utils.toBN(Math.round(web3.utils.fromWei('188729959600000', 'gwei')))
      if (paymentTokenName.includes("Tether")) {
        unit='ether'
      }
      break;
    case 'Ethereum Mainnet':
      gasFee = web3.utils.toBN(Math.round(web3.utils.fromWei(result, 'gwei')))
      console.log(gasFee)
      break;
    default:
      // gasFee = web3.utils.toHex(web3.utils.toWei('100', 'gwei'))
      gasFee = web3.utils.toBN(Math.round(web3.utils.fromWei('188729959600000', 'gwei')))
      if (paymentTokenName.includes("Tether")) {
        unit='ether'
      }
    }
    
    let walletCall
    // Trigger Transaction
    if (paymentTokenName.includes("Ethereum")) {
      // Special handling for Ethereum
      console.log(`Read to send ${paymentTokenName} with no contract address`)
      walletCall = web3.eth.sendTransaction({
        from: fromAddr, 
        to: toAddr, 
        value: web3.utils.toWei(amount, 'ether'), 
        gas: gasFee
      })
      .on('error', (error, receipt) => {
        console.log('error')
        console.log(error)
        onFail(receipt)
      })
      .then((receipt) => {
        console.log(receipt)
        onSuccess(receipt)
      });
      return walletCall;
    } // else HIDDEN {
      // Other Tokens
      console.log(`Read to send ${paymentTokenName}`)
      
      // Get the ABI from etherscan
      getEtherscanAbi(chainName, contractAddr).then((response) => {
        if (response.data.status === '1') {
            console.log(response.data.message);
            abiEtherscan = JSON.parse(response.data.result);
            contract = new web3.eth.Contract(abiEtherscan, contractAddr);
        
        } else {
          // Use local ABI when fail to get
          console.log(response.data.message);
          console.log(response.data.result);
          console.log('Query ABI from Etherscan fail, use local ABI file instead');
          contract = new web3.eth.Contract(abi, contractAddr);
        }
        
        walletCall = contract.methods
        .transfer(toAddr, web3.utils.toWei(amount, unit))
        .send({
            from: fromAddr,
            // value: web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
            gas: gasFee,
            // gas: web3.utils.toHex(42000),
            chainId: targetChainId,
            data: ''
        })gasFeeHexror)
            onFail(receipt)
        })
        .then((receipt) => {
            console.log(receipt)
            onSuccess(receipt)
            // processReceipt(receipt, product, currencyName, chain, deliveryType)
        });

        return walletCall
          
      }) 
    // HIDDEN ELSE } 

  })
}
  */

export async function triggerTransactionv2(chainId, contractAddr, paymentTokenName, fromAddr, toAddr, amount, onSuccess, onFail) {
  let abiEtherscan;
  let abiLocal;
  let contract;
  let walletExist=false;
  let targetChainId=chainId

  checkWalletExist()
  /*
  checkWalletExist()

  const chainListJSON = await getChainlistJSON().then((response) => {
    if (response.status === 200) {
      // return response.data
      console.log(localChainList)
      return localChainList
    } 
      return localChainList
    
  }
  )

  await chainListJSON.forEach((item)=>{
    if (chainName===item.name){
      targetChainId = item.chainId
    }
  })
  // console.log(targetChainId)
  
  // Check wallet exists
  walletExist = await checkWalletExist;


  // Change the current network to target chain
  if (window.ethereum.networkVersion !== targetChainId) {
    console.log('read to change network')
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(targetChainId) }]
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Polygon Mainnet',
              chainId: web3.utils.toHex(targetChainId),
              // nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
              // rpcUrls: ['https://polygon-rpc.com/']
            }
          ]
        });
      }
    }
  }
  */
  console.debug("-----Transaction info-----")
  console.debug("chainId",chainId)
  console.debug("contractAddr",contractAddr)
  console.debug("paymentTokenName",paymentTokenName)
  console.debug("fromAddr",fromAddr)
  console.debug("toAddr", toAddr)
  console.debug("amount",amount)
  console.debug("-----Ready to get the gas price-----")


  // Get the gas price
  web3.eth.getGasPrice().then(async (result) => {
    
    console.log('GasFee in Wei from web3.eth.getGasPrice() result')
    console.log(result)

    let gasFeeHex
    let gasFee
    let unit

    // Unit Adjustment
    if (paymentTokenName.includes("Tether")) {
      unit='mwei'
    } else {
      unit='ether'
    }

    console.log("chainId", chainId)
    console.log()
          //case 'Ethereum Mainnet':

    switch (String(chainId)) {
      case '0x1':
        //console.log("after web3.utils.toBN(Math.round(web3.utils.fromWei(result, 'gwei')")  
        
        console.log("=====Gas price in gwei from web3.eth.getGasPrice()=====")  
        console.log("-------This fee is the priority fee -----")  
        console.log("-------According to how fast you want the transaction to complete, it should be 1+n% and put to maxPriorityFeePerGas -----") 
        lowGasFeeGwei = web3.utils.fromWei(result, 'gwei')
        console.log('gasPrice after to gwei', lowGasFeeGwei)
        lowGasFeeWei = web3.utils.fromWei(result, 'wei')
        console.log('gasPrice after to wei', lowGasFeeWei)

        console.log("=====Priority Fee calculations:=====") 
        priorityFeeWei = Math.round(lowGasFeeWei*1.05)
        priorityFeeGwei = web3.utils.fromWei(priorityFeeWei, 'gwei')
        console.log('priorityFee to gwei', priorityFeeGwei)
        priorityFeeGwei = Math.round((priorityFeeGwei) * 100) / 100
        console.log('priorityFee to gwei after Round', priorityFeeGwei)
        priorityFeeWei = web3.utils.toWei(priorityFeeGwei, 'gwei')
        console.log('priorityFee back to wei after Round', priorityFeeWei)

        console.log("=====Max Fee calculations:=====") 
        /*
        maxFeeWei = Math.round(lowGasFeeWei*1.05)
        maxFeeGwei = web3.utils.fromWei(maxFeeWei, 'gwei')
        console.log('maxFee to gwei', maxFeeGwei)
        maxFeeGwei = Math.round((maxFeeGwei) * 100) / 100
        console.log('maxFee to gwei after Round', maxFeeGwei)
        maxFeeWei = web3.utils.toWei(maxFeeGwei, 'gwei')
        console.log('maxFee back to wei after Round', maxFeeWei)
        */
        
        await web3.eth.getBlock("pending").then((block) => {
          const baseFee = Number(block.baseFeePerGas);
          console.log("=====baseFee from web3.eth.getBlock()=====")  
          console.log('baseFee',baseFee)  
          //maxFeeWei = parseInt(priorityFeeWei, 10)+baseFee-1
          maxFeeWei = parseInt(lowGasFeeWei, 10)+baseFee-1
        })
        maxFeeGwei = web3.utils.fromWei(maxFeeWei, 'gwei')
        console.log('maxFee to gwei', maxFeeGwei)
        maxFeeGwei = Math.round((maxFeeGwei) * 100) / 100
        console.log('maxFee to gwei after Round', maxFeeGwei)
        maxFeeWei = web3.utils.toWei(maxFeeGwei, 'gwei')
        console.log('maxFee back to wei after Round', maxFeeWei)

        // Convert to hexadecimal string and pad to 16 characters (64 bits)
        lowGasFeeHex = parseInt(lowGasFeeWei, 10).toString(16);
        priorityFeeHex = parseInt(priorityFeeWei, 10).toString(16);
        maxFeeHex = parseInt(maxFeeWei, 10).toString(16);

        console.log('lowGasFee in Hex',lowGasFeeHex)
        console.log('priorityFee in Hex',priorityFeeHex)
        console.log('maxFee in Hex',maxFeeHex)

        lowGasFeeHex = lowGasFeeHex.padStart(16, '0');
        priorityFeeHex = priorityFeeHex.padStart(16, '0');
        maxFeeHex = maxFeeHex.padStart(16, '0');
    
        // Add the '0x' prefix
        lowGasFeeHex=`0x${lowGasFeeHex}`
        priorityFeeHex=`0x${priorityFeeHex}`
        maxFeeHex=`0x${maxFeeHex}`
        console.log('final lowGasFee in Hex',lowGasFeeHex)
        console.log('final priorityFee in Hex',priorityFeeHex)
        console.log('final maxFee in Hex',maxFeeHex)
      break;

      case 'Rinkeby':
        // gasFee = web3.utils.toHex(web3.utils.toWei('100', 'gwei'))
        gasFee = web3.utils.toBN(Math.round(web3.utils.fromWei('188729959600000', 'gwei')))
        if (paymentTokenName.includes("Tether")) {
          unit='ether'
        }
      break;
    
      default:
        // gasFee = web3.utils.toHex(web3.utils.toWei('100', 'gwei'))
        /*
        gasFee = web3.utils.toBN(Math.round(web3.utils.fromWei('188729959600000', 'gwei')))
        if (paymentTokenName.includes("USDT")) {
          unit='ether'
        }*/

        gasFee = Math.round(web3.utils.fromWei(result, 'gwei'))
        //gasFee = web3.utils.toBN(Math.round(web3.utils.fromWei(result, 'gwei')))
        //console.log(gasFee)
        //const gasbigIntValue = BigInt(gasFee);
        //console.log(gasbigIntValue)
        // Convert to hexadecimal string and pad to 16 characters (64 bits)
        gasFeeHex = gasFee.toString(16).padStart(16, '0');
    
        // Add the '0x' prefix
        gasFeeHex=`0x${gasFeeHex}`
        console.log(gasFeeHex)
    }
    //console.log(`Test pt1 ${paymentTokenName}`)
    
    let walletCall
    // Trigger Transaction
    if (paymentTokenName.includes("Ethereum")) {
      // Special handling for Ethereum
      console.log("=============================================")
      console.log(`Read to send ${paymentTokenName} with no contract address`)
      walletCall = web3.eth.sendTransaction({
        from: fromAddr, 
        to: toAddr, 
        value: web3.utils.toWei(amount, 'ether'), 
        gas: gasFee
      })
      .on('error', (error, receipt) => {
        console.log('error')
        console.log(error)
        onFail(receipt)
      })
      .then((receipt) => {
        console.log(receipt)
        onSuccess(receipt)
      });
      return walletCall;
    } else {
      // Other Tokens
      console.log("=============================================")
      console.log(`Read to send ERC20 token ${paymentTokenName} token Address ${contractAddr}`)
      
      // Get the ABI from etherscan
      getEtherscanAbi(chainId, contractAddr).then((response) => {
        if (response.status === '1') {
        //if (response.status === '1' && false) {
          console.log("Get ABI from Etherscan API successfully.")  
          console.log(response.message);
          abiEtherscan = JSON.parse(response.result);
          contract = new web3.eth.Contract(abiEtherscan, contractAddr);
        
        } else {
          // Use local ABI when fail to get
          console.log("Fail to get ABI from Etherscan API. Use local ABI file instead")
          //console.log(response.message);
          //console.log(response.result);
          console.log('Query ABI from Etherscan fail, use local ABI file instead');
          /*
          fetch(abierc20)
          .then((res) => res.text())
          .then((text) => {
            abiLocal = JSON.parse(abierc20);
          })
          .catch((e) => console.error(e));
          console.log("abiLocal",abiLocal);
          */
          
          //console.log("abierc20",abierc20);
          contract = new web3.eth.Contract(abierc20, contractAddr);
        }

        console.log(`Going to send ${amount} ${unit} `)
        const amountHex = '0x'+Number(amount).toString(16) //2544 MNEM

        const amountWei = web3.utils.toWei(amount, unit)
        console.log(`Convert to ${amountWei} wei`)
        const amountWeiHex = '0x'+Number(amountWei).toString(16) //9040x16 MNEM

        //const amountEther = web3.utils.toEther(amountWei, 'wei')
        //console.log(`Convert to ${amountEther} ether`)
        //const amountEtherHex = '0x'+Number(amountEther).toString(16)

        console.log(`from ${fromAddr} to ${toAddr} in chainId ${targetChainId}`)

        //console.log(contract)
        walletCall = contract.methods
        .transfer(toAddr, web3.utils.toWei(amount, unit))
        .send({
            from: fromAddr,
            // value: web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
            //gasPrice: lowGasFeeHex,
            gas: web3.utils.toHex(65000),
            maxPriorityFeePerGas: lowGasFeeHex,
            maxFeePerGas: maxFeeHex,
            chainId: targetChainId,
            data: ''
        })
        .on('transactionHash', (hash) => {
          console.log("=======Transaction Hash received but NOT yet confirmed=======")
          console.log('Transaction Hash:', hash);
          // You can handle the transaction hash here, e.g., save it or display it to the user
          onSuccess(hash)
        })
        .on('error', (error, receipt) => {
            console.log('error')
            console.log(error)
            console.log(receipt)
            //onFail(receipt)
        })
        .then((receipt) => {
            console.log("=======Transfer success=======")
            console.log(receipt)
            onSuccess(receipt.transactionHash)
            // processReceipt(receipt, product, currencyName, chain, deliveryType)
        });

        return walletCall
          
      }) 
     } // HIDDEN ELSE for debug 

  })
}

 