
// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
const hre = require("hardhat");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  //console.log("Account balance:", (await deployer.getBalance).toString());

    const HonorToken = await ethers.getContractFactory("SoulboundToken");
    const honorToken = await HonorToken.deploy("Honor Token", "HONOR");

    const DishonorToken = await ethers.getContractFactory("SoulboundToken");
    const dishonorToken = await DishonorToken.deploy("Dishonor Token", "DISHONOR");

    console.log("Honor Token deployed to:", honorToken.address);
    console.log("Dishonor Token deployed to:", dishonorToken.address);

    const HonorDAO = await ethers.getContractFactory("HonorDAO");
    const dao = await HonorDAO.deploy(honorToken.address, dishonorToken.address);
    console.log("HonorDAO deployed to:", dao.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(honorToken);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("SoulboundToken");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });