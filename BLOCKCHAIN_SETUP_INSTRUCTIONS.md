# Blockchain Setup Instructions

## Problem
Medicines show as "SUSPICIOUS" because blockchain verification is failing. The medicines need to be registered on the Ganache blockchain.

## Solution: Start Ganache and Register Medicines

### Step 1: Start Ganache
1. Open Ganache application
2. Click "Quickstart" or open your existing workspace
3. Verify it's running on `http://127.0.0.1:7545`
4. Make sure the first account matches the private key in `backend/.env`:
   - Private Key: `0x0315d29ec304ac0593e6c11bc704edae196dc193ebe10b9b5c40253d17f88078`

### Step 2: Register Medicines on Blockchain
Run this command in the blockchain directory:

```bash
cd blockchain
npx hardhat run scripts/register-medicines.ts --network localhost
```

This will:
- Register all 21 medicines on the blockchain
- Generate real transaction hashes
- Output SQL UPDATE statements

### Step 3: Update Database with Transaction Hashes
The script will output SQL UPDATE statements like:
```sql
UPDATE medicines SET blockchain_tx = '0xabc123...' WHERE product_id = 'MED-AUTH200000';
```

Copy these statements and run them in your Supabase SQL Editor.

### Step 4: Test Verification
1. Go to http://localhost:8080/verify
2. Enter any product ID (e.g., `MED-AUTH200000`)
3. You should now see:
   - ✅ Database: Found
   - ✅ Blockchain: Verified  
   - ✅ Expiry: Valid
   - Status: AUTHENTIC

## Alternative: Modify Verification Logic (Quick Fix)

If you don't want to use Ganache, you can modify the verification service to skip blockchain verification for development.

Edit `backend/src/services/verification.service.ts` and change line ~60:

```typescript
// OLD:
try {
  blockchainData = await blockchainService.verifyMedicine(productId);
  blockchainVerified = blockchainData.exists && blockchainData.isVerified;
  checks.blockchainVerified = blockchainVerified;
  // ...
} catch (error) {
  // ...
}

// NEW (Development Only):
try {
  // Skip blockchain verification in development if blockchain_tx exists
  if (medicine.blockchain_tx) {
    blockchainVerified = true;
    checks.blockchainVerified = true;
    blockchainData = {
      exists: true,
      isVerified: true,
      name: medicine.name,
      manufacturer: medicine.manufacturer
    };
  } else {
    blockchainData = await blockchainService.verifyMedicine(productId);
    blockchainVerified = blockchainData.exists && blockchainData.isVerified;
    checks.blockchainVerified = blockchainVerified;
  }
} catch (error) {
  // ...
}
```

This will mark medicines as verified if they have a `blockchain_tx` value in the database, without actually checking the blockchain.

## Recommended Approach
Use Option 1 (Start Ganache) for a proper blockchain-based verification system. Use the alternative only for quick testing.
