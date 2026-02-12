import { ethers } from 'hardhat';

const medicines = [
  { product_id: 'MED-AUTH200000', name: 'Paracetamol 500mg', manufacturer: 'Nepal Pharma Ltd', manufacture_date: '2026-01-01', expiry_date: '2026-12-31' },
  { product_id: 'MED-AUTH200001', name: 'Amoxicillin 250mg', manufacturer: 'Himalayan Drugs', manufacture_date: '2026-01-01', expiry_date: '2027-06-30' },
  { product_id: 'MED-AUTH200002', name: 'Ibuprofen 400mg', manufacturer: 'Nepal Pharma Ltd', manufacture_date: '2026-01-01', expiry_date: '2026-11-15' },
  { product_id: 'MED-AUTH200003', name: 'Ciprofloxacin 500mg', manufacturer: 'Kathmandu Pharmaceuticals', manufacture_date: '2026-01-01', expiry_date: '2027-03-20' },
  { product_id: 'MED-AUTH200004', name: 'Metformin 500mg', manufacturer: 'Himalayan Drugs', manufacture_date: '2026-01-01', expiry_date: '2027-08-10' },
  { product_id: 'MED-AUTH200005', name: 'Omeprazole 20mg', manufacturer: 'Nepal Pharma Ltd', manufacture_date: '2026-01-01', expiry_date: '2026-10-25' },
  { product_id: 'MED-AUTH200006', name: 'Aspirin 75mg', manufacturer: 'Pokhara Medicines', manufacture_date: '2026-01-01', expiry_date: '2027-05-18' },
  { product_id: 'MED-AUTH200007', name: 'Atorvastatin 10mg', manufacturer: 'Kathmandu Pharmaceuticals', manufacture_date: '2026-01-01', expiry_date: '2027-02-14' },
  { product_id: 'MED-AUTH200008', name: 'Losartan 50mg', manufacturer: 'Himalayan Drugs', manufacture_date: '2026-01-01', expiry_date: '2027-07-22' },
  { product_id: 'MED-AUTH200009', name: 'Amlodipine 5mg', manufacturer: 'Nepal Pharma Ltd', manufacture_date: '2026-01-01', expiry_date: '2026-09-30' },
  { product_id: 'MED-AUTH200010', name: 'Cetirizine 10mg', manufacturer: 'Pokhara Medicines', manufacture_date: '2026-01-01', expiry_date: '2027-04-12' },
  { product_id: 'MED-AUTH200011', name: 'Azithromycin 500mg', manufacturer: 'Kathmandu Pharmaceuticals', manufacture_date: '2026-01-01', expiry_date: '2027-01-28' },
  { product_id: 'MED-AUTH200012', name: 'Doxycycline 100mg', manufacturer: 'Himalayan Drugs', manufacture_date: '2026-01-01', expiry_date: '2027-06-15' },
  { product_id: 'MED-AUTH200013', name: 'Ranitidine 150mg', manufacturer: 'Nepal Pharma Ltd', manufacture_date: '2026-01-01', expiry_date: '2026-12-20' },
  { product_id: 'MED-AUTH200014', name: 'Diclofenac 50mg', manufacturer: 'Pokhara Medicines', manufacture_date: '2026-01-01', expiry_date: '2027-03-08' },
  { product_id: 'MED-AUTH200015', name: 'Prednisolone 5mg', manufacturer: 'Kathmandu Pharmaceuticals', manufacture_date: '2026-01-01', expiry_date: '2027-08-25' },
  { product_id: 'MED-AUTH200016', name: 'Levothyroxine 50mcg', manufacturer: 'Himalayan Drugs', manufacture_date: '2026-01-01', expiry_date: '2027-05-30' },
  { product_id: 'MED-AUTH200017', name: 'Salbutamol 100mcg', manufacturer: 'Nepal Pharma Ltd', manufacture_date: '2026-01-01', expiry_date: '2026-11-10' },
  { product_id: 'MED-AUTH200018', name: 'Insulin Glargine 100U', manufacturer: 'Pokhara Medicines', manufacture_date: '2026-01-01', expiry_date: '2027-02-28' },
  { product_id: 'MED-AUTH200019', name: 'Warfarin 5mg', manufacturer: 'Kathmandu Pharmaceuticals', manufacture_date: '2026-01-01', expiry_date: '2027-07-15' },
  { product_id: 'MED-AUTH200020', name: 'Furosemide 40mg', manufacturer: 'Himalayan Drugs', manufacture_date: '2026-01-01', expiry_date: '2027-04-20' }
];

function dateToTimestamp(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

async function main() {
  console.log('🚀 Starting blockchain registration...\n');

  // Get the contract
  const contractAddress = '0x6567B54d06A447c107e95528D6205fdF371b7849A';
  const MedicineVerification = await ethers.getContractAt('MedicineVerification', contractAddress);

  console.log('📝 Contract address:', contractAddress);
  console.log('📦 Total medicines to register:', medicines.length);
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const txHashes: { [key: string]: string } = {};

  for (const medicine of medicines) {
    try {
      const manufactureTimestamp = dateToTimestamp(medicine.manufacture_date);
      const expiryTimestamp = dateToTimestamp(medicine.expiry_date);

      console.log(`⏳ Registering: ${medicine.product_id} - ${medicine.name}`);

      const tx = await MedicineVerification.registerMedicine(
        medicine.product_id,
        medicine.name,
        medicine.manufacturer,
        manufactureTimestamp,
        expiryTimestamp
      );

      const receipt = await tx.wait();
      txHashes[medicine.product_id] = receipt.hash;

      console.log(`✅ Success! TX: ${receipt.hash.substring(0, 20)}...`);
      successCount++;
    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n📊 Registration Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  if (successCount > 0) {
    console.log('\n📝 Transaction Hashes:');
    Object.entries(txHashes).forEach(([productId, hash]) => {
      console.log(`   ${productId}: ${hash}`);
    });

    console.log('\n💾 SQL Update Statement:');
    console.log('-- Run this in Supabase SQL Editor to update blockchain_tx values\n');
    Object.entries(txHashes).forEach(([productId, hash]) => {
      console.log(`UPDATE medicines SET blockchain_tx = '${hash}' WHERE product_id = '${productId}';`);
    });
  }

  console.log('\n✨ Blockchain registration complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
