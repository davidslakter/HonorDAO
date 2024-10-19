// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SoulboundToken is ERC20 {
    address public owner;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = msg.sender;
    }

    // Mint function, only callable by owner
    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner can mint tokens");
        _mint(to, amount);
    }

    // Override the transfer function to disable transfers
    function _transfer(address from, address to, uint256 amount) internal pure override {
        require(false, "Soulbound tokens are non-transferable");
    }
}