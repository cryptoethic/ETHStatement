pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract RedditorETH is Ownable {

    /* --- EVENTS --- */

    event InvestorStatement(address indexed investor, uint amount);

    /* --- FIELDS --- */

    mapping (address => uint) public investors;

    /* --- CONSTRUCTOR --- */

    constructor() public {
        
    }

    /* --- PUBLIC / EXTERNAL METHODS --- */

    function getInvestorAmount(address investor) view public returns(uint) {
        return investors[investor];
    }

}