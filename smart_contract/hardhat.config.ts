import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/OkylwiShDSWs4r_zE_yRfpLoVpSfQx2V`, // or another provider like Alchemy
      accounts: ['0x304cc0b109c5fa8eccc1623e49cf581723e25149a3e9e95d9fe077e1d268a16c'],
    },
  }
};

export default config;
