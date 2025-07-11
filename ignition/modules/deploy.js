// Define an async function called main to execute the deployment logic
async function main() {
    // Get a contract factory (template) for the "SimpleStrage" contract
    const ToDo = await ethers.getContractFactory("ToDo");

    // Print a message to show that deployment is starting
    console.log("Deploying smart contract.....");

    // Deploy the contract using the factory, and get a contract instance
    const toDo = await ToDo.deploy();

    // Wait until the contract is fully deployed on the blockchain
    await toDo.deployed(); //this is for ethers v5
    await toDo.waitForDeployment(); //this is for ethers v6


    // Print the address where the contract was deployed
    console.log(`Deployed contract to: ${toDo.address}`); // this is for ethers v5
    console.log(`Deployed contract to: ${toDo.target}`); // this is for ethers v6
    
}