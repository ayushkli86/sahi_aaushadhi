# Blockchain Layer

Smart contracts for medicine verification using Hardhat and Solidity.

## Setup

```bash
npm install
```

## Compile Contracts

```bash
npm run compile
```

## Run Tests

```bash
npm test
```

## Deploy

Local network:
```bash
npm run node
# In another terminal:
npm run deploy
```

## Contract: MedicineVerification

Main contract for registering and verifying pharmaceutical products on the blockchain.

### Functions

- `registerMedicine()` - Register a new medicine product
- `verifyMedicine()` - Verify if a product exists and get its details
- `getMedicine()` - Get full medicine details by product ID
