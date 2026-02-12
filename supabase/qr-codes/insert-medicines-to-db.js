const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://bshvpxzkezzxgfewbzax.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaHZweHprZXp6eGdmZXdiemF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTQyNTksImV4cCI6MjA4NjM5MDI1OX0.g7Pu4-fQyNC9AWawzyr9Fs7KHPUmWgP60QWKLfBkypE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const medicines = [
  { product_id: 'MED-AUTH200000', name: 'Paracetamol 500mg', manufacturer: 'Nepal Pharma Ltd', batch_number: 'NPL-2026-PAR-001', manufacture_date: '2026-01-01', expiry_date: '2026-12-31', description: 'Paracetamol 500mg - Nepal Pharma Ltd', blockchain_tx: '0x9dc141c1fda52623c20bd5fe908d232cdfcfd8ab8b498b8a9fbd118d9dd5dbe5' },
  { product_id: 'MED-AUTH200001', name: 'Amoxicillin 250mg', manufacturer: 'Himalayan Drugs', batch_number: 'HD-2026-AMX-002', manufacture_date: '2026-01-01', expiry_date: '2027-06-30', description: 'Amoxicillin 250mg - Himalayan Drugs', blockchain_tx: '0xddaca74b78332c6240f02e60d4bb12a63113ce7f9c9e4e0152d0756e21c9087b' },
  { product_id: 'MED-AUTH200002', name: 'Ibuprofen 400mg', manufacturer: 'Nepal Pharma Ltd', batch_number: 'NPL-2026-IBU-003', manufacture_date: '2026-01-01', expiry_date: '2026-11-15', description: 'Ibuprofen 400mg - Nepal Pharma Ltd', blockchain_tx: '0x92a43aa4e7742900ca56403e0de50045e1ee593b425903d212520ed807d24e7e' },
  { product_id: 'MED-AUTH200003', name: 'Ciprofloxacin 500mg', manufacturer: 'Kathmandu Pharmaceuticals', batch_number: 'KP-2026-CIP-004', manufacture_date: '2026-01-01', expiry_date: '2027-03-20', description: 'Ciprofloxacin 500mg - Kathmandu Pharmaceuticals', blockchain_tx: '0x31bf7b4c11c10c5ff2c0290761619ace331f2a49f0675671cc147e0425d3b7bd' },
  { product_id: 'MED-AUTH200004', name: 'Metformin 500mg', manufacturer: 'Himalayan Drugs', batch_number: 'HD-2026-MET-005', manufacture_date: '2026-01-01', expiry_date: '2027-08-10', description: 'Metformin 500mg - Himalayan Drugs', blockchain_tx: '0x4c280ebacb337ebb96f6f81be277f0b42fb5d5df84fc8f069bff3c7800c34484' },
  { product_id: 'MED-AUTH200005', name: 'Omeprazole 20mg', manufacturer: 'Nepal Pharma Ltd', batch_number: 'NPL-2026-OME-006', manufacture_date: '2026-01-01', expiry_date: '2026-10-25', description: 'Omeprazole 20mg - Nepal Pharma Ltd', blockchain_tx: '0xba262285953278f188109358a5d0ff501586bab2b240fea54bc9c25e74f79510' },
  { product_id: 'MED-AUTH200006', name: 'Aspirin 75mg', manufacturer: 'Pokhara Medicines', batch_number: 'PM-2026-ASP-007', manufacture_date: '2026-01-01', expiry_date: '2027-05-18', description: 'Aspirin 75mg - Pokhara Medicines', blockchain_tx: '0xe2b24e70968e1ba5d5e884b12da8480b7cf255f0ebead09ed46b67b1daa8c1b5' },
  { product_id: 'MED-AUTH200007', name: 'Atorvastatin 10mg', manufacturer: 'Kathmandu Pharmaceuticals', batch_number: 'KP-2026-ATO-008', manufacture_date: '2026-01-01', expiry_date: '2027-02-14', description: 'Atorvastatin 10mg - Kathmandu Pharmaceuticals', blockchain_tx: '0x4e40c244acab240ac12e09b7c865fab1827ca209484a83df06ddccefc1a23122' },
  { product_id: 'MED-AUTH200008', name: 'Losartan 50mg', manufacturer: 'Himalayan Drugs', batch_number: 'HD-2026-LOS-009', manufacture_date: '2026-01-01', expiry_date: '2027-07-22', description: 'Losartan 50mg - Himalayan Drugs', blockchain_tx: '0xfa01842259938da334e9223aa247627170835296d7e74b2da5f5a8ce1e283d83' },
  { product_id: 'MED-AUTH200009', name: 'Amlodipine 5mg', manufacturer: 'Nepal Pharma Ltd', batch_number: 'NPL-2026-AML-010', manufacture_date: '2026-01-01', expiry_date: '2026-09-30', description: 'Amlodipine 5mg - Nepal Pharma Ltd', blockchain_tx: '0x9f52fbda42a4fc4345e1cf60f20e3e20641db43bd1182cc433e9967af6abe3f4' },
  { product_id: 'MED-AUTH200010', name: 'Cetirizine 10mg', manufacturer: 'Pokhara Medicines', batch_number: 'PM-2026-CET-011', manufacture_date: '2026-01-01', expiry_date: '2027-04-12', description: 'Cetirizine 10mg - Pokhara Medicines', blockchain_tx: '0x4c0a6dee8bfd4f7c57f570223faa879d8d2a87840901618e1a4e9f33b6645fbd' },
  { product_id: 'MED-AUTH200011', name: 'Azithromycin 500mg', manufacturer: 'Kathmandu Pharmaceuticals', batch_number: 'KP-2026-AZI-012', manufacture_date: '2026-01-01', expiry_date: '2027-01-28', description: 'Azithromycin 500mg - Kathmandu Pharmaceuticals', blockchain_tx: '0x5f14316102cebe50ae8c90604cf94cb06421de13d8e529142d2f4888f081c53d' },
  { product_id: 'MED-AUTH200012', name: 'Doxycycline 100mg', manufacturer: 'Himalayan Drugs', batch_number: 'HD-2026-DOX-013', manufacture_date: '2026-01-01', expiry_date: '2027-06-15', description: 'Doxycycline 100mg - Himalayan Drugs', blockchain_tx: '0xc7d08b3c5e73a0742462e2d26f93fba19466d2630b77f0d6ac4b3abd5f5e4133' },
  { product_id: 'MED-AUTH200013', name: 'Ranitidine 150mg', manufacturer: 'Nepal Pharma Ltd', batch_number: 'NPL-2026-RAN-014', manufacture_date: '2026-01-01', expiry_date: '2026-12-20', description: 'Ranitidine 150mg - Nepal Pharma Ltd', blockchain_tx: '0xa9187d51f242ffde2f14641381c879e967dcb4c944617fe59fe6a5624e8556d5' },
  { product_id: 'MED-AUTH200014', name: 'Diclofenac 50mg', manufacturer: 'Pokhara Medicines', batch_number: 'PM-2026-DIC-015', manufacture_date: '2026-01-01', expiry_date: '2027-03-08', description: 'Diclofenac 50mg - Pokhara Medicines', blockchain_tx: '0xb4f44fdbe85307ceff4503172acc81d7289aed4e8d533c1b0931eb020797efee' },
  { product_id: 'MED-AUTH200015', name: 'Prednisolone 5mg', manufacturer: 'Kathmandu Pharmaceuticals', batch_number: 'KP-2026-PRE-016', manufacture_date: '2026-01-01', expiry_date: '2027-08-25', description: 'Prednisolone 5mg - Kathmandu Pharmaceuticals', blockchain_tx: '0x17791184bad0b274f9cd228fe8faab2bbc8ec8be7942c5be52bbb7c8b5d09956' },
  { product_id: 'MED-AUTH200016', name: 'Levothyroxine 50mcg', manufacturer: 'Himalayan Drugs', batch_number: 'HD-2026-LEV-017', manufacture_date: '2026-01-01', expiry_date: '2027-05-30', description: 'Levothyroxine 50mcg - Himalayan Drugs', blockchain_tx: '0x42b60cfebf01612986d4aa2018866b121f123178290c4729c817966919d9824d' },
  { product_id: 'MED-AUTH200017', name: 'Salbutamol 100mcg', manufacturer: 'Nepal Pharma Ltd', batch_number: 'NPL-2026-SAL-018', manufacture_date: '2026-01-01', expiry_date: '2026-11-10', description: 'Salbutamol 100mcg - Nepal Pharma Ltd', blockchain_tx: '0xb5f92b31c99c53a6752938ce9ef91255391da440752855c78b0376870326324e' },
  { product_id: 'MED-AUTH200018', name: 'Insulin Glargine 100U', manufacturer: 'Pokhara Medicines', batch_number: 'PM-2026-INS-019', manufacture_date: '2026-01-01', expiry_date: '2027-02-28', description: 'Insulin Glargine 100U - Pokhara Medicines', blockchain_tx: '0x8cb21589ffd26641addd06be15734186be1ebc6523e69b231950ae6f245de3a0' },
  { product_id: 'MED-AUTH200019', name: 'Warfarin 5mg', manufacturer: 'Kathmandu Pharmaceuticals', batch_number: 'KP-2026-WAR-020', manufacture_date: '2026-01-01', expiry_date: '2027-07-15', description: 'Warfarin 5mg - Kathmandu Pharmaceuticals', blockchain_tx: '0xc9c9addd83004f473872e600ab6acc889423e591646044f27f3d57c31e7a6578' },
  { product_id: 'MED-AUTH200020', name: 'Furosemide 40mg', manufacturer: 'Himalayan Drugs', batch_number: 'HD-2026-FUR-021', manufacture_date: '2026-01-01', expiry_date: '2027-04-20', description: 'Furosemide 40mg - Himalayan Drugs', blockchain_tx: '0xa07eec32ea9347a530ea4803bd2b54c024ba4c7706b147d099092339d617ba19' }
];

async function insertMedicines() {
  console.log('🚀 Starting medicine data insertion...');
  console.log(`📦 Total medicines to insert: ${medicines.length}\n`);

  try {
    // Insert medicines in batches
    const { data, error } = await supabase
      .from('medicine')
      .upsert(medicines, { onConflict: 'product_id' })
      .select();

    if (error) {
      console.error('❌ Error inserting medicines:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data.length} medicines!`);
    console.log('\n📋 Inserted Product IDs:');
    data.forEach((med, i) => {
      console.log(`   ${i + 1}. ${med.product_id} - ${med.name}`);
    });

    console.log('\n✨ All medicines are now available for verification!');
    console.log('🔍 You can now verify these product IDs in the app.');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

insertMedicines();
