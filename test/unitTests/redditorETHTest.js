import {createWeb3, deployContract, createContract} from '../testUtils.js';
import redditorETHJson from '../../build/contracts/RedditorETH.json';
import Web3 from 'web3';
import chai from 'chai';
import bnChai from 'bn-chai';

const {expect} = chai;
const web3 = createWeb3(Web3);
const {BN} = web3.utils;
chai.use(bnChai(BN));

describe('RedditorETH Contract', () => {
  let contract;
  let deployer;

  before(async () => {
    const accounts = await web3.eth.getAccounts();
    [deployer] = accounts;
  });

  beforeEach(async () => {
    contract = await deployContract(web3, redditorETHJson, deployer, []); 
  });

  it('contract creation', async () => { 
    expect(contract.options.address).not.to.be.undefined; 
    expect(await (contract.methods.owner().call())).to.be.equal(deployer);
  });
});
