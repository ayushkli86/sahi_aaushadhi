# Architecture Documentation

## System Overview

The Counterfeit Medicine Blockchain system consists of three main layers:

1. Frontend (React + Vite)
2. Blockchain (Hardhat + Solidity)
3. Backend (Future API layer)

## Components

### Frontend
- User interface for medicine verification
- Dashboard for stakeholders
- QR code scanning and generation
- Blockchain interaction via ethers.js

### Blockchain
- Smart contracts for medicine registration
- Immutable record keeping
- Verification logic

### Database
- Supabase for off-chain data
- User management
- Analytics and reporting

## Data Flow

1. Manufacturer registers medicine → Blockchain
2. User scans QR code → Frontend
3. Frontend queries blockchain → Verification result
4. DDA monitors all transactions → Dashboard
