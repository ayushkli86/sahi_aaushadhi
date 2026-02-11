# Backend Architecture

## 🏗️ Layer Separation (Clean Architecture)

### 1️⃣ CONTROLLERS (HTTP Layer)
**Responsibility**: Handle HTTP requests/responses ONLY

```typescript
// ✅ CORRECT
async verifyQR(req, res) {
  const result = await verificationService.verify(req.body);
  res.json(result);
}

// ❌ WRONG - No business logic in controllers!
async verifyQR(req, res) {
  const blockchain = await contract.verify(); // ❌
  const db = await database.query(); // ❌
}
```

**Files**: `controllers/*.controller.ts`

### 2️⃣ ROUTES (Routing Layer)
**Responsibility**: Map URLs to controllers

```typescript
router.post("/verify", verifyQR);
```

**Files**: `routes/*.routes.ts`

### 3️⃣ VALIDATORS (Input Security)
**Responsibility**: Validate and sanitize input

```typescript
qrToken: string (UUID)
signature: string
timestamp: number
```

**Files**: `validators/*.validator.ts`

### 4️⃣ SERVICES (Business Logic Layer) ⭐ MOST IMPORTANT
**Responsibility**: ALL business logic

```typescript
// verification.service.ts
async verify(qrData) {
  // 1. Parse QR
  // 2. Check DB
  // 3. Call blockchain
  // 4. Return result
}
```

**Files**: `services/*.service.ts`

### 5️⃣ MIDDLEWARE (Cross-cutting Concerns)
**Responsibility**: Auth, logging, error handling

**Files**: `middleware/*.ts`

---

## 🔐 QR AUTHENTICATION FLOW

### STEP 1: QR GENERATION (Backend)
```
generateQR(productId):
  → create random nonce (UUID)
  → hash = SHA256(productId + nonce + timestamp)
  → store hash in DB
  → register hash on blockchain
  → return QR image with hash
```

**Why**: 
- One-time use (nonce prevents replay)
- Tamper-proof (blockchain record)
- Expirable (timestamp)

### STEP 2: QR SCANNING (Frontend)
```
User scans QR → Frontend sends:
{
  "qrHash": "abc123...",
  "productId": "MED-001",
  "timestamp": 1234567890
}
```

### STEP 3: VERIFICATION (Backend)
```
verify(qrHash, productId):
  → check QR exists in DB
  → check not expired (5 min)
  → check not already used
  → call blockchain.verifyQR(hash)
  → if valid → mark as used
  → return result
```

### STEP 4: BLOCKCHAIN VERIFICATION
```
Smart Contract:
  mapping(bytes32 => bool) public validQR;
  
  function verifyQR(bytes32 hash) returns (bool) {
    return validQR[hash];
  }
```

---

## 🔗 FILE RESPONSIBILITY MAP

| File | Responsibility |
|------|---------------|
| `qr.service.ts` | QR creation + hashing |
| `verification.service.ts` | Full verification orchestration |
| `blockchain.service.ts` | Contract calls ONLY |
| `database.service.ts` | DB operations ONLY |
| `auth.service.ts` | JWT + sessions |
| `validators/*` | Input security |
| `middleware/auth.ts` | Protected routes |
| `controllers/*` | HTTP layer |

---

## 🚨 COMMON MISTAKES TO AVOID

❌ **Blockchain logic in controllers**
```typescript
// WRONG
async verify(req, res) {
  const contract = new ethers.Contract(...); // ❌
}
```

❌ **QR verification only in DB**
```typescript
// WRONG - Must verify on blockchain too!
const qr = await db.getQR(hash);
return qr.isValid; // ❌
```

❌ **No expiration on QR**
```typescript
// WRONG - QR must expire!
generateQR(productId) {
  return hash; // ❌ No timestamp
}
```

❌ **Storing raw data on-chain**
```typescript
// WRONG
contract.store(productId, name, manufacturer); // ❌ Too much data
```

✅ **CORRECT**
```typescript
contract.registerQR(hash); // ✅ Only hash
```

---

## 🎯 SECURITY FEATURES

1. **One-time QR codes** - Nonce prevents reuse
2. **Expiration** - 5 minute validity
3. **Blockchain verification** - Tamper-proof
4. **Audit trail** - All verifications logged
5. **Rate limiting** - Prevent abuse
6. **JWT auth** - Secure API access
7. **Role-based access** - Different permissions

---

## 📊 DATA FLOW

```
User → QR Code → Frontend → Backend → Blockchain → Backend → Frontend

1. Backend creates QR token
2. QR is scanned
3. Backend verifies it
4. Blockchain confirms it
5. Access granted/denied
```

---

## 🗄️ DATABASE SCHEMA

### qr_records
```sql
qr_hash (PK)
product_id (FK)
expires_at
used (boolean)
used_at
created_at
```

### medicines
```sql
product_id (PK)
name
manufacturer
batch_number
manufacture_date
expiry_date
blockchain_tx
registered_by
created_at
```

### verification_logs
```sql
id (PK)
product_id
is_valid
verified_at
ip_address
metadata (JSON)
```

---

## 🔧 SMART CONTRACT INTERFACE

```solidity
// Register QR hash
function registerQR(bytes32 hash, string productId) external;

// Verify QR hash
function verifyQR(bytes32 hash) external view returns (bool);

// Get product from QR
function getProductFromQR(bytes32 hash) external view returns (string);
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [x] Layer separation (controllers, services, etc.)
- [x] QR generation with nonce
- [x] QR expiration (5 min)
- [x] One-time use enforcement
- [x] Blockchain verification
- [x] Database storage
- [x] Audit logging
- [x] Error handling
- [x] Input validation
- [x] Rate limiting
- [x] JWT authentication
- [x] Role-based access

---

## 🚀 NEXT STEPS

1. Deploy smart contract
2. Initialize blockchain service with contract ABI
3. Set up Supabase database tables
4. Configure environment variables
5. Test QR generation flow
6. Test verification flow
7. Add frontend integration
