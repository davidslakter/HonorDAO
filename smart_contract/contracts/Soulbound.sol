
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SoulboundToken is ERC20 {
    address public minter;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function setMinter(address _minter) external {
        minter = _minter; // Set the allowed minter to the honor DAO contract
    }

    // Mint function, only callable by the minter
    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only minter can mint tokens");
        _mint(to, amount);
    }

    // Override transfer functions to disable transfers
    function transfer(address, uint256) public pure override returns (bool) {
        revert("Soulbound token: Transfers are disabled");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("Soulbound token: Transfers are disabled");
    }
}