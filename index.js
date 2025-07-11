require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.static(__dirname));
app.use(express.json());
const path = require("path");
// const ethers = require("ethers");


const port = 3000;

app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/index.html", (req, res) =>{
    res.sendFile(path.join(__dirname, "index.html"));
})

// const API_URL = process.env.API_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;


// const{abi} = require("./artifacts/contracts/ToDo.sol/ToDo.json");
// const provider = new ethers.JsonRpcProvider(API_URL);


// const signer = new ethers.Wallet(PRIVATE_KEY, provider);


// const contractAddress = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// app.post("/addTask", async(req, res) => {
//     const task = req.body.task;

//     async function storeDataInBlockchain(task) {
//         console.log("Adding the task in the blockchain network....");
//         const tx = await contractAddress.addTask(task)
//         await tx.wait();
//     }

//     await storeDataInBlockchain(task);
//     res.send("The task has been registered")
// })


// app.post("/changeStatus", async(req, res) => {
//     const id = req.body.id;

//     async function storeDataInBlockchain(id) {
//         console.log("Changing task status.....");
//         const tx = await contractAddress.maskAsFinished(id)
//         await tx.wait();
//     }

//     await storeDataInBlockchain(task);
//     res.send("The task has been completed")
// })


app.listen(port, function(){
    console.log(`App listening on port ${port}`)
})