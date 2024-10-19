// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Soulbound.sol"; // Import the soulbound token contracts

contract HonorDAO {
    SoulboundToken public honorToken;
    SoulboundToken public dishonorToken;

    address public owner;

    constructor(address _honorTokenAddress, address _dishonorTokenAddress) {
        owner = msg.sender;
        honorToken = SoulboundToken(_honorTokenAddress);
        dishonorToken = SoulboundToken(_dishonorTokenAddress);
    }

    // Mint Honor tokens
    function mintHonor(address to, uint256 amount) external onlyOwner {
        honorToken.mint(to, amount);
    }

    // Mint Dishonor tokens
    function mintDishonor(address to, uint256 amount) external onlyOwner {
        dishonorToken.mint(to, amount);
    }

    // Only owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
}