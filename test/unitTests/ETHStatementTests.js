import {createWeb3, deployContract, createContract, expectThrow} from '../testUtils.js';
import ETHStatementJson from '../../build/contracts/ETHStatement.json';
import Web3 from 'web3';
import chai from 'chai';
import bnChai from 'bn-chai';

const {expect} = chai;
const web3 = createWeb3(Web3);
const {BN} = web3.utils;
chai.use(bnChai(BN));

describe('ETHStatement Contract', () => {
  const oneETH = web3.utils.toWei('1', 'ether');
  const twoETH = web3.utils.toWei('2', 'ether');
  const threeETH = web3.utils.toWei('3', 'ether');
  const emailAddress = 'test@email.com';

  let contract;
  let deployer;
  let firstInvestor;
  let secondInvestor;

  const getTotalAmount = async () => await contract.methods.totalAmount().call();

  before(async () => {
    const accounts = await web3.eth.getAccounts();
    [deployer, firstInvestor, secondInvestor] = accounts;
  });

  beforeEach(async () => {
    contract = await deployContract(web3, ETHStatementJson, deployer, []); 
  });

  it('contract creation', async () => { 
    expect(contract.options.address).not.to.be.undefined;  
    expect(await getTotalAmount()).to.be.eq.BN(0);
  });

  it('investor can define amount he wills to invest', async () => {
    const receipt = await contract.methods.declare(oneETH).send({from:firstInvestor}); 
    expect(receipt.events).to.have.all.keys('InvestorStatement');
  });

  it('investor cannot define more ETH than he posses', async() => {
    const tooMuchETH = web3.utils.toWei('90000001', 'ether');
    await expectThrow(contract.methods.declare(tooMuchETH).send({from: firstInvestor}));
  });


  it('total amount should be set appropriately ', async() => {
    expect(await getTotalAmount()).to.be.eq.BN(0);
    await contract.methods.declare(oneETH).send({from: firstInvestor}); 
    expect(await getTotalAmount()).to.be.eq.BN(oneETH); 
    await contract.methods.declare(twoETH).send({from: firstInvestor}); 
    expect(await getTotalAmount()).to.be.eq.BN(twoETH); 
    await contract.methods.declare(oneETH).send({from: secondInvestor}); 
    expect(await getTotalAmount()).to.be.eq.BN(threeETH); 
  });

  it('investor can leave email address while declaring his ETH amount to invest', async () => {
    const receipt = await contract.methods.declare(oneETH, emailAddress).send({from:firstInvestor}); 
    expect(receipt.events.InvestorStatement.returnValues.email).to.be.equal(emailAddress);
  });

  it('we can get investor declared amount and email', async () => {
    await contract.methods.declare(oneETH, emailAddress).send({from:firstInvestor});  
    
    const statement = await contract.methods.getInvestorStatement(firstInvestor).call();

    expect(statement[0]).to.be.eq.BN(oneETH);
    expect(statement[1]).to.be.equal(emailAddress);
  });
});
