# MediChain Backend API

Production-ready backend API for the Counterfeit Medicine Blockchain System.

## Features

- ✅ RESTful API with Express.js
- ✅ TypeScript for type safety
- ✅ JWT Authentication & Authorization
- ✅ Role-based access control (Consumer, Manufacturer, DDA, Admin)
- ✅ Blockchain integration (Ethereum/Hardhat)
- ✅ QR code generation with AES-256 encryption
- ✅ Supabase database integration
- ✅ Request validation with Joi
- ✅ Rate limiting
- ✅ Comprehensive logging with Winston
- ✅ Error handling middleware
- ✅ CORS and security headers (Helmet)

## Tech Stack

- Node.js + Express
- TypeScript
- Supabase (PostgreSQL)
- Ethers.js (Blockchain)
- JWT (Authentication)
- Bcrypt (Password hashing)
- Winston (Logging)
- Joi (Validation)

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Fill in your environment variables:
   - Supabase credentials
   - JWT secret
   - Blockchain RPC URL and contract address
   - Encryption key

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Medicine Management
- `POST /api/medicines/register` - Register new medicine (Auth required)
- `GET /api/medicines` - Get all medicines (Auth required)
- `GET /api/medicines/:productId` - Get medicine by ID
- `GET /api/medicines/:productId/qr` - Generate QR code

### Verification
- `POST /api/verify` - Verify medicine by product ID
- `POST /api/verify/qr` - Verify medicine by QR code
- `GET /api/verify/logs` - Get verification logs

### Analytics (Admin/DDA only)
- `GET /api/analytics/stats` - Get system statistics
- `GET /api/analytics/verifications` - Get verification trends
- `GET /api/analytics/manufacturers` - Get manufacturer statistics

### User Management
- `GET /api/users/profile` - Get user profile (Auth required)
- `PUT /api/users/profile` - Update user profile (Auth required)
- `GET /api/users` - Get all users (Admin only)

## User Roles

- `consumer` - Can verify medicines
- `manufacturer` - Can register medicines
- `distributor` - Can track distribution
- `pharmacy` - Can verify and dispense
- `dda` - Drug Distribution Authority (monitoring)
- `admin` - Full system access

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Rate limiting (100 requests per 15 minutes)
- AES-256 encryption for QR codes
- CORS protection
- Helmet security headers
- Input validation

## Database Schema

### Users Table
- id (UUID)
- email
- password (hashed)
- name
- role
- created_at

### Medicines Table
- product_id (unique)
- name
- manufacturer
- batch_number
- manufacture_date
- expiry_date
- description
- blockchain_tx
- registered_by
- created_at

### Verification Logs Table
- id
- product_id
- is_valid
- verified_at
- ip_address
- method

## Testing

```bash
npm test
```

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error logs only
- `combined.log` - All logs

## License

MIT
