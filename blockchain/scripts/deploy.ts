import { ethers } from "hardhat";

async function main() {
  console.log("Deploying MedicineVerification contract...");

  const MedicineVerification = await ethers.getContractFactory("MedicineVerification");
  const contract = await MedicineVerification.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`MedicineVerification deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
