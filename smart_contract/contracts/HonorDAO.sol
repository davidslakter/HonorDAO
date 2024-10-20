
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Soulbound.sol";

contract HonorDAO {
    SoulboundToken public honorToken;
    SoulboundToken public dishonorToken;

    mapping(bytes32 => bool) private usedTransactionHashes;
    address public owner;

    constructor(address _honorTokenAddress, address _dishonorTokenAddress) {
        owner = msg.sender;
        honorToken = SoulboundToken(_honorTokenAddress);
        dishonorToken = SoulboundToken(_dishonorTokenAddress);

        honorToken.setMinter(address(this));
        dishonorToken.setMinter(address(this));
    }

    //Check if a transaction has already been sent Honor 
    function isTransactionHashUsed(bytes32 _txHash) public view returns (bool) {
        return usedTransactionHashes[_txHash];
    }

    function sendTransactionHonor(bytes32 _txHash, bytes memory signature, bool honor, address to) public {
        require(usedTransactionHashes[_txHash] == false, "Honor already sent for the transaction");
        require(verifyTransactionHash(_txHash, signature, msg.sender), "Signature is Invalid");

        if (honor) {
            mintHonor(to);
        } else {
            mintDishonor(to);
        }
        usedTransactionHashes[_txHash] = true;
    }

    function verifyTransactionHash(
        bytes32 txHash,
        bytes memory signature,
        address userAddress
    ) internal pure returns (bool) {
        // Split the signature into r, s, and v
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Length check for signature
        require(signature.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Adjust v value for EIP-155
        if (v < 27) {
            v += 27;
        }

        // Recover the address from the signature
        address recoveredAddress = ecrecover(txHash, v, r, s);
        return (recoveredAddress == userAddress);
    }

    // Mint Honor tokens
    function mintHonor(address to) internal {
        //uint256 oneFullToken = 1 * 10 ** honorToken.decimals();
        honorToken.mint(to, 1);
    }

    // Mint Dishonor tokens
    function mintDishonor(address to) internal {
        //uint256 oneFullToken = 1 * 10 ** honorToken.decimals();
        dishonorToken.mint(to, 1);
    }

    // Only owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
}