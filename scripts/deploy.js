const hre = require("hardhat");

async function main() {
  const ChatApp = await hre.ethers.getContractFactory("ChatApp");

  const chatApp = await ChatApp.deploy();

  // ethers v6 compatible
  await chatApp.waitForDeployment();

  console.log("Contract Address:", await chatApp.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//npx hardhat run scripts/deploy.js --network holesky
//npx hardhat run scripts/deploy.js --network localhost
