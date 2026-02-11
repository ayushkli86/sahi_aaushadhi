import { expect } from "chai";
import { ethers } from "hardhat";

describe("MedicineVerification", function () {
  it("Should register a new medicine", async function () {
    const MedicineVerification = await ethers.getContractFactory("MedicineVerification");
    const contract = await MedicineVerification.deploy();
    await contract.waitForDeployment();

    const productId = "MED001";
    const name = "Aspirin";
    const manufacturer = "PharmaCorp";
    const manufactureDate = Math.floor(Date.now() / 1000);
    const expiryDate = manufactureDate + (365 * 24 * 60 * 60); // 1 year later

    await contract.registerMedicine(
      productId,
      name,
      manufacturer,
      manufactureDate,
      expiryDate
    );

    const medicine = await contract.getMedicine(productId);
    expect(medicine.name).to.equal(name);
    expect(medicine.manufacturer).to.equal(manufacturer);
    expect(medicine.isVerified).to.equal(true);
  });

  it("Should verify an existing medicine", async function () {
    const MedicineVerification = await ethers.getContractFactory("MedicineVerification");
    const contract = await MedicineVerification.deploy();
    await contract.waitForDeployment();

    const productId = "MED002";
    const manufactureDate = Math.floor(Date.now() / 1000);
    const expiryDate = manufactureDate + (365 * 24 * 60 * 60);

    await contract.registerMedicine(
      productId,
      "Paracetamol",
      "MediCo",
      manufactureDate,
      expiryDate
    );

    const result = await contract.verifyMedicine(productId);
    expect(result.exists).to.equal(true);
    expect(result.name).to.equal("Paracetamol");
  });
});
