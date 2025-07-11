# 📝 LetsDo - Blockchain Based ToDo Application

A decentralized task manager built with **HTML, CSS, JavaScript, Solidity**, and **Node.js** (backend).  
This project allows users to manage tasks securely on the Ethereum blockchain.

---

## 🚀 Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Smart Contracts**: Solidity  
- **Blockchain Network**: Sepolia (Alchemy)  
- **Backend**: Node.js  
- **Other Tools**: Hardhat, Ethers.js, Etherscan API

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/w3rew0lf11/LetsDo.git
cd LetsDo
```

### 2. Install dependencies

```bash
npm install
```
### 3. Setup Environment Variables

```bash
API_URL=YOUR_ALCHEMY_API_URL_HERE
PRIVATE_KEY=YOUR_METAMASK_WALLET_PRIVATE_KEY
CONTRACT_ADDRESS=TO_BE_FILLED_AFTER_DEPLOYMENT
API_KEY=YOUR_ETHERSCAN_API_KEY
```

### 4. Smart Contract Deployment

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. run the project with
```bash
node index.js
```
