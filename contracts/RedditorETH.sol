pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract RedditorETH is Ownable {

    /* --- EVENTS --- */

    event InvestorStatement(address indexed investor, uint amount);

    /* --- FIELDS --- */

    mapping (address => uint) public investors;
    uint public totalAmount;

    /* --- CONSTRUCTOR --- */

    constructor() public {
        
    }

    /* --- PUBLIC / EXTERNAL METHODS --- */

    function announce(uint amount) external { 
        require(msg.sender.balance >= amount, "You don't have enough ETH.");
        totalAmount += amount - investors[msg.sender];
        investors[msg.sender] = amount; 

        emit InvestorStatement(msg.sender, amount);
    }

    function getInvestorAmount(address investor) view public returns(uint) {
        return investors[investor];
    }

}