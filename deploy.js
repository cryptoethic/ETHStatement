/* eslint-disable import/first */
import Web3 from 'web3';

const createWeb3 = (Web3, numberOfAccounts = 10) => {
  const web3 = new Web3();
  const Ganache = require('ganache-core');
  const ganacheOptions = {
    accounts: (new Array(numberOfAccounts)).fill({balance: web3.utils.toWei('90000000')})
  };
  web3.setProvider(Ganache.provider(ganacheOptions));
  return web3;
};

let web3;
let account;
let from;
let usingInfura = false;

const deployContract = async (json, constructorArguments, name) => {
  console.log(`Deploying ${name}...`);
  const deployMethod = await new web3.eth.Contract(json.abi)
    .deploy({data: json.bytecode, arguments: constructorArguments});

  if (!usingInfura) {
    const contract = await deployMethod.send({from, gas: 6000000});
    console.log(`Deployed ${name} at ${contract.options.address}`);
    return contract;
  }

  const tx = {
    from,
    gas: 5000000,
    gasPrice: 600000000,
    data: deployMethod.encodeABI()
  };
  const signedTx = await account.signTransaction(tx);
  const {contractAddress} = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Deployed ${name} at ${contractAddress}`);
  return await new web3.eth.Contract(json.abi, contractAddress);
};

const sendTransaction = async (method, name, to, value = 0) => {
  console.log(`Sending transaction: ${name}...`);
  if (!usingInfura) {
    return await method.send({from, gas: 6000000});
  }

  const tx = {
    from,
    to,
    gas: 3000000,
    gasPrice: 600000000,
    data: method.encodeABI(),
    value
  };
  const signedTx = await account.signTransaction(tx);
  return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
};

(async () => {
  if (process.env.PRIVATE_KEY) {
    usingInfura = true;
    web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/YjJOPQ1J3Iw1QPeH3xRS'));
    account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    from = account.address;
    console.log(`Using infura with account: ${from}`);
  } else {
    web3 = createWeb3(Web3);
    [from] = await web3.eth.getAccounts();
    console.log('Using ganache');
  } 
  
})().catch(console.error);
/* eslint-enable import/first */
