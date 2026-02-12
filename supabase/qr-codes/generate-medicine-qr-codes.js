/**
 * Sahi Aaushadi - QR Code Generator for Medicines
 * Generates QR codes for MED-AUTH200000 to MED-AUTH200020
 * 
 * Usage: node generate-medicine-qr-codes.js
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Medicine data from insert-medicines.sql
const medicines = [
  { productId: 'MED-AUTH200000', name: 'Paracetamol 500mg', manufacturer: 'Nepal Pharma Ltd', batchNumber: 'NPL-2026-PAR-001', manufactureDate: '2026-01-01', expiryDate: '2026-12-31' },
  { productId: 'MED-AUTH200001', name: 'Amoxicillin 250mg', manufacturer: 'Himalayan Drugs', batchNumber: 'HD-2026-AMX-002', manufactureDate: '2026-01-01', expiryDate: '2027-06-30' },
  { productId: 'MED-AUTH200002', name: 'Ibuprofen 400mg', manufacturer: 'Nepal Pharma Ltd', batchNumber: 'NPL-2026-IBU-003', manufactureDate: '2026-01-01', expiryDate: '2026-11-15' },
  { productId: 'MED-AUTH200003', name: 'Ciprofloxacin 500mg', manufacturer: 'Kathmandu Pharmaceuticals', batchNumber: 'KP-2026-CIP-004', manufactureDate: '2026-01-01', expiryDate: '2027-03-20' },
  { productId: 'MED-AUTH200004', name: 'Metformin 500mg', manufacturer: 'Himalayan Drugs', batchNumber: 'HD-2026-MET-005', manufactureDate: '2026-01-01', expiryDate: '2027-08-10' },
  { productId: 'MED-AUTH200005', name: 'Omeprazole 20mg', manufacturer: 'Nepal Pharma Ltd', batchNumber: 'NPL-2026-OME-006', manufactureDate: '2026-01-01', expiryDate: '2026-10-25' },
  { productId: 'MED-AUTH200006', name: 'Aspirin 75mg', manufacturer: 'Pokhara Medicines', batchNumber: 'PM-2026-ASP-007', manufactureDate: '2026-01-01', expiryDate: '2027-05-18' },
  { productId: 'MED-AUTH200007', name: 'Atorvastatin 10mg', manufacturer: 'Kathmandu Pharmaceuticals', batchNumber: 'KP-2026-ATO-008', manufactureDate: '2026-01-01', expiryDate: '2027-02-14' },
  { productId: 'MED-AUTH200008', name: 'Losartan 50mg', manufacturer: 'Himalayan Drugs', batchNumber: 'HD-2026-LOS-009', manufactureDate: '2026-01-01', expiryDate: '2027-07-22' },
  { productId: 'MED-AUTH200009', name: 'Amlodipine 5mg', manufacturer: 'Nepal Pharma Ltd', batchNumber: 'NPL-2026-AML-010', manufactureDate: '2026-01-01', expiryDate: '2026-09-30' },
  { productId: 'MED-AUTH200010', name: 'Cetirizine 10mg', manufacturer: 'Pokhara Medicines', batchNumber: 'PM-2026-CET-011', manufactureDate: '2026-01-01', expiryDate: '2027-04-12' },
  { productId: 'MED-AUTH200011', name: 'Azithromycin 500mg', manufacturer: 'Kathmandu Pharmaceuticals', batchNumber: 'KP-2026-AZI-012', manufactureDate: '2026-01-01', expiryDate: '2027-01-28' },
  { productId: 'MED-AUTH200012', name: 'Doxycycline 100mg', manufacturer: 'Himalayan Drugs', batchNumber: 'HD-2026-DOX-013', manufactureDate: '2026-01-01', expiryDate: '2027-06-15' },
  { productId: 'MED-AUTH200013', name: 'Ranitidine 150mg', manufacturer: 'Nepal Pharma Ltd', batchNumber: 'NPL-2026-RAN-014', manufactureDate: '2026-01-01', expiryDate: '2026-12-20' },
  { productId: 'MED-AUTH200014', name: 'Diclofenac 50mg', manufacturer: 'Pokhara Medicines', batchNumber: 'PM-2026-DIC-015', manufactureDate: '2026-01-01', expiryDate: '2027-03-08' },
  { productId: 'MED-AUTH200015', name: 'Prednisolone 5mg', manufacturer: 'Kathmandu Pharmaceuticals', batchNumber: 'KP-2026-PRE-016', manufactureDate: '2026-01-01', expiryDate: '2027-08-25' },
  { productId: 'MED-AUTH200016', name: 'Levothyroxine 50mcg', manufacturer: 'Himalayan Drugs', batchNumber: 'HD-2026-LEV-017', manufactureDate: '2026-01-01', expiryDate: '2027-05-30' },
  { productId: 'MED-AUTH200017', name: 'Salbutamol 100mcg', manufacturer: 'Nepal Pharma Ltd', batchNumber: 'NPL-2026-SAL-018', manufactureDate: '2026-01-01', expiryDate: '2026-11-10' },
  { productId: 'MED-AUTH200018', name: 'Insulin Glargine 100U', manufacturer: 'Pokhara Medicines', batchNumber: 'PM-2026-INS-019', manufactureDate: '2026-01-01', expiryDate: '2027-02-28' },
  { productId: 'MED-AUTH200019', name: 'Warfarin 5mg', manufacturer: 'Kathmandu Pharmaceuticals', batchNumber: 'KP-2026-WAR-020', manufactureDate: '2026-01-01', expiryDate: '2027-07-15' },
  { productId: 'MED-AUTH200020', name: 'Furosemide 40mg', manufacturer: 'Himalayan Drugs', batchNumber: 'HD-2026-FUR-021', manufactureDate: '2026-01-01', expiryDate: '2027-04-20' },
];

// Create output directory
const outputDir = path.join(__dirname, 'batch-format-qr-codes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// QR Code generation options
const qrOptions = {
  errorCorrectionLevel: 'H',
  type: 'png',
  quality: 1,
  margin: 2,
  width: 400,
  color: {
    dark: '#0D9488',  // Teal color
    light: '#FFFFFF'
  }
};

// Generate QR codes
async function generateQRCodes() {
  console.log('🔄 Starting QR Code Generation...\n');
  console.log(`📦 Total Medicines: ${medicines.length}\n`);

  const results = [];

  for (const medicine of medicines) {
    try {
      // QR Code data - Batch format (no JSON quotes)
      const qrData = `Batch No: ${medicine.batchNumber}
Name: ${medicine.name}
Manufacturer: ${medicine.manufacturer}
Expiry Date: ${medicine.expiryDate}`;

      // Generate QR code
      const filename = `${medicine.productId}.png`;
      const filepath = path.join(outputDir, filename);
      
      await QRCode.toFile(filepath, qrData, qrOptions);
      
      results.push({
        productId: medicine.productId,
        name: medicine.name,
        manufacturer: medicine.manufacturer,
        expiryDate: medicine.expiryDate,
        filename: filename,
        status: 'success'
      });

      console.log(`✅ Generated: ${filename} - ${medicine.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${medicine.productId} - ${error.message}`);
      results.push({
        productId: medicine.productId,
        name: medicine.name,
        status: 'failed',
        error: error.message
      });
    }
  }

  // Generate summary report
  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`📁 Output Directory: ${outputDir}`);
  console.log('='.repeat(60) + '\n');

  // Save summary as JSON
  const summaryPath = path.join(outputDir, 'generation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalMedicines: medicines.length,
    successCount,
    failedCount,
    results
  }, null, 2));

  console.log(`📄 Summary saved: ${summaryPath}\n`);

  // Generate HTML index for easy viewing
  generateHTMLIndex(results);
}

// Generate HTML index page
function generateHTMLIndex(results) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sahi Aaushadi - Full Data QR Codes</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    h1 {
      color: #0D9488;
      text-align: center;
      margin-bottom: 10px;
      font-size: 2.5em;
    }
    .subtitle {
      text-align: center;
      color: #64748b;
      margin-bottom: 20px;
      font-size: 1.1em;
    }
    .info-banner {
      background: linear-gradient(135deg, #0D9488 0%, #14b8a6 100%);
      color: white;
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      margin-bottom: 30px;
    }
    .info-banner h3 {
      margin-bottom: 10px;
      font-size: 1.3em;
    }
    .info-banner p {
      opacity: 0.9;
      line-height: 1.6;
    }
    .stats {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 40px;
    }
    .stat-card {
      background: linear-gradient(135deg, #0D9488 0%, #14b8a6 100%);
      color: white;
      padding: 20px 40px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);
    }
    .stat-value {
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 25px;
      margin-top: 30px;
    }
    .card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 15px;
      padding: 20px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(13, 148, 136, 0.2);
      border-color: #0D9488;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #0D9488, #14b8a6);
    }
    .qr-container {
      text-align: center;
      margin-bottom: 15px;
      background: #f8fafc;
      padding: 15px;
      border-radius: 10px;
    }
    .qr-container img {
      max-width: 200px;
      height: auto;
      border-radius: 8px;
    }
    .product-id {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      color: #0D9488;
      font-size: 1.1em;
      margin-bottom: 10px;
      text-align: center;
    }
    .medicine-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
      font-size: 1.1em;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.9em;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #64748b;
      font-weight: 500;
    }
    .info-value {
      color: #334155;
      font-weight: 600;
    }
    .data-badge {
      display: inline-block;
      background: #14b8a6;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75em;
      font-weight: 600;
      margin-top: 10px;
    }
    .download-btn {
      display: block;
      width: 100%;
      padding: 10px;
      background: linear-gradient(135deg, #0D9488 0%, #14b8a6 100%);
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
      margin-top: 15px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .download-btn:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 15px rgba(13, 148, 136, 0.4);
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e2e8f0;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🏥 Sahi Aaushadi</h1>
    <p class="subtitle">Full Data QR Codes - Complete Medicine Information</p>
    
    <div class="info-banner">
      <h3>📦 Batch Format QR Codes</h3>
      <p>These QR codes contain medicine information in plain text format:<br>
      <strong>Batch No • Name • Manufacturer • Expiry Date</strong></p>
      <p style="margin-top: 10px; font-size: 0.9em;">
        ✅ Easy to read format without JSON quotes
      </p>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${results.length}</div>
        <div class="stat-label">Total Medicines</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${results.filter(r => r.status === 'success').length}</div>
        <div class="stat-label">QR Codes Generated</div>
      </div>
    </div>

    <div class="grid">
      ${results.filter(r => r.status === 'success').map(medicine => `
        <div class="card">
          <div class="qr-container">
            <img src="${medicine.filename}" alt="${medicine.productId}">
            <div class="data-badge">BATCH FORMAT</div>
          </div>
          <div class="product-id">${medicine.productId}</div>
          <div class="medicine-name">${medicine.name}</div>
          <div class="info-row">
            <span class="info-label">Manufacturer:</span>
            <span class="info-value">${medicine.manufacturer}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Expiry Date:</span>
            <span class="info-value">${new Date(medicine.expiryDate).toLocaleDateString()}</span>
          </div>
          <a href="${medicine.filename}" download class="download-btn">
            📥 Download QR Code
          </a>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      <p style="margin-top: 10px;"><strong>QR Code Type:</strong> Batch Format (Plain Text)</p>
      <p style="margin-top: 10px;">© 2026 Sahi Aaushadi - Securing Nepal's Pharmaceutical Supply Chain</p>
    </div>
  </div>
</body>
</html>
  `;

  const htmlPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`🌐 HTML Index generated: ${htmlPath}`);
  console.log(`   Open in browser: file://${htmlPath}\n`);
}

// Run the generator
generateQRCodes().catch(error => {
  console.error('❌ Fatal Error:', error);
  process.exit(1);
});
