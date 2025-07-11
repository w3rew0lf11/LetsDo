// auth.js
import { BrowserProvider, Contract } from "https://cdn.jsdelivr.net/npm/ethers@6.10.0/dist/ethers.min.js";

let WALLET_CONNECTED = "";
const CONTRACT_ADDRESS = "0x4571b008de32A173074762b98b5F770976f7fd10";
let contractAbi = [];
let contract;

const connectMetamask = async () => {
    if (!window.ethereum) return alert("MetaMask not found!");

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    WALLET_CONNECTED = await signer.getAddress();

    // Save to localStorage so dashboard.html can use it
    localStorage.setItem("wallet_address", WALLET_CONNECTED);

    // Load ABI
    const res = await fetch("public/abi.json");
    const data = await res.json();
    contractAbi = data.abi;

    // Create contract instance
    contract = new Contract(CONTRACT_ADDRESS, contractAbi, signer);

    // ✅ Redirect to dashboard
    window.location.href = "dashboard.html";
};

// Properly expose to window object
window.connectMetamask = connectMetamask;