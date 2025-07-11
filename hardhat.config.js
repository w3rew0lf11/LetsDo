require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: API_KEY,
    },
  },
};

console.log("API_URL:", process.env.API_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
