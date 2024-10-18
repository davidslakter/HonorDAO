// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HonorToken is ERC20, Ownable {
    // Mapping to keep track of addresses that cannot transfer tokens
    mapping(address => bool) private frozenAccounts;

    // Constructor to initialize the token and set the initial owner
    constructor(address initialOwner) ERC20("HonorToken", "HON") {
        transferOwnership(initialOwner); // Set the initial owner
    }

    // Mint function to create and send soul-bound tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        // Automatically freeze the recipient from transferring tokens
        freezeAccount(to);
    }

    // Freeze an account from transferring tokens
    function freezeAccount(address account) internal {
        frozenAccounts[account] = true;
    }

    // Override transfer function to restrict transfers
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(!frozenAccounts[msg.sender], "Account is soul-bound and cannot transfer tokens.");
        return super.transfer(to, amount);
    }

    // Override transferFrom function to restrict transfers
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(!frozenAccounts[from], "Account is soul-bound and cannot transfer tokens.");
        return super.transferFrom(from, to, amount);
    }
}