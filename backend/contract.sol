// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BestPoolFinder {
    address public owner;
    uint public bestAPY;
    uint public bestAPYdecimal;
    string public bestPoolAddress;
    string public bestPoolName;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }
    
    function setBestPool(string memory poolAddress, string memory poolName, uint apy, uint decimal) public onlyOwner {
        bestAPY = apy;
        bestPoolAddress = poolAddress;
        bestPoolName = poolName;
        bestAPYdecimal = decimal;
    }
    
    function getBestPool() public view returns (string memory, string memory, uint, uint) {
        return (bestPoolAddress, bestPoolName, bestAPY, bestAPYdecimal);
    }
}