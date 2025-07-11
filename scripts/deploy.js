const { ethers } = require("hardhat");

// Define an async function called main to execute the deployment logic
async function main() {
  // Get a contract factory (template) for the "TODO" contract
  const ToDo = await ethers.getContractFactory("ToDo");

  // Print a message to show that deployment is starting
  console.log("Deploying smart contract.....");

  // Deploy the contract using the factory, and get a contract instance
  const toDo = await ToDo.deploy();

  // Wait until the contract is fully deployed on the blockchain
  await toDo.waitForDeployment();

  if (network.config.chainId === 11155111 && process.env.API_KEY) {
    console.log("Waiting for confirmations....");
    await toDo.deploymentTransaction().wait(6);
    console.log("Waiting 30 seconds for Etherscan to index the contract...");
    await new Promise((resolve) => setTimeout(resolve, 30000));
    await verify(toDo.target, []);
  }

  // Print the address where the contract was deployed
  console.log(`Deployed contract to: ${toDo.target}`);
}

//verify function
async function verify(contractAddress, args) {
  console.log("Verifying contract....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
