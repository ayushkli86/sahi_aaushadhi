# Sahi Aaushadi - Medicine Verification System

**A blockchain-powered platform to eliminate counterfeit medicines in Nepal**

[![Status](https://img.shields.io/badge/status-production--ready-success)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Node](https://img.shields.io/badge/node-v24.13.1-green)]()

---

## 🎯 Overview

Sahi Aaushadi is a government-grade medicine verification system that combines blockchain technology, QR code authentication, and real-time database verification to protect Nepal's pharmaceutical supply chain from counterfeit medicines.

### Key Features

- **🔍 Real-time Verification** - Instant medicine authenticity checks
- **🔗 Blockchain Integration** - Immutable verification records
- **📱 QR Code Scanning** - One-time use, time-limited QR codes
- **🤖 AI Chatbot** - Intelligent assistant for medicine verification
- **📊 Analytics Dashboard** - Real-time statistics and insights
- **🛡️ Multi-layer Security** - Database + Blockchain + Expiry checks
- **👥 Role-based Access** - Consumer, Manufacturer, Pharmacy, DDA, Admin

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │  React + Vite + TypeScript
│   Port 8080     │  Tailwind CSS + ShadCN UI
└────────┬────────┘
         │ REST API
         ↓
┌─────────────────┐
│   Backend       │  Node.js + Express + TypeScript
│   Port 5000     │  JWT Auth + Rate Limiting
└────────┬────────┘
         │
         ├──────→ Supabase (PostgreSQL + Auth)
         │
         └──────→ Ganache/Ethereum (Smart Contracts)
```

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + ShadCN UI
- React Query (data fetching)
- React Router (navigation)
- Framer Motion (animations)

**Backend:**
- Node.js + Express
- TypeScript
- Supabase (database + auth)
- Ethers.js (blockchain)
- JWT authentication
- Winston (logging)

**Blockchain:**
- Solidity smart contracts
- Hardhat (development)
- Ganache (local testing)
- Ethereum-compatible networks

---

## 🚀 Quick Start

### Prerequisites

- Node.js v24.13.1+
- npm or yarn
- Ganache (for local blockchain)
- Supabase account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sahi_aaushadhi

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install blockchain dependencies (optional)
cd ../blockchain
npm install
```

### Configuration

1. **Setup Supabase Database**

Run this SQL in your Supabase SQL Editor:

```sql
-- Add name column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
```

2. **Configure Backend** (`backend/.env`)

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key

ENCRYPTION_KEY=your_32_character_key
```

3. **Configure Frontend** (`frontend/.env`)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_BLOCKCHAIN_RPC_URL=http://127.0.0.1:7545
VITE_CHAIN_ID=1337
```

### Running the Application

```bash
# Terminal 1: Start Ganache (local blockchain)
ganache-cli -p 7545

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

Access the application at: **http://localhost:8080**

---

## 📱 Features

### 1. Medicine Verification

**Verify by Product ID:**
- Enter medicine product ID
- Get instant authenticity status
- View detailed medicine information
- See verification checks (database, blockchain, expiry)

**Verify by QR Code:**
- Scan QR code with camera
- Auto-detection and verification
- One-time use security
- 5-minute expiry protection

**Verification Statuses:**
- ✅ **AUTHENTIC** - Genuine, verified medicine
- 🚨 **COUNTERFEIT** - Fake, not registered
- ⏰ **EXPIRED** - Authentic but past expiry
- ⚠️ **SUSPICIOUS** - Partial verification failure

### 2. QR Code System

**Batch Format QR Codes:**
```
Batch No: NPL-2026-PAR-001
Name: Paracetamol 500mg
Manufacturer: Nepal Pharma Ltd
Expiry Date: 2026-12-31
```

**Features:**
- Plain text format (no JSON)
- Industry-standard batch tracking
- Human-readable information
- Offline data access
- 400x400px PNG images
- Teal color branding

**Generation:**
```bash
cd supabase/qr-codes
npm run generate
```

View generated QR codes: `supabase/qr-codes/batch-format-qr-codes/index.html`

### 3. AI Chatbot Assistant

**Capabilities:**
- Real-time medicine verification
- System information and help
- Security feature explanations
- Counterfeit reporting guidance
- Natural language understanding
- Context-aware responses

**Usage:**
- Click floating chat button (bottom-right)
- Type queries or use quick actions
- Get instant, intelligent responses

### 4. Analytics Dashboard

**Real-time Metrics:**
- Total verifications
- Authentic vs counterfeit ratio
- Verification trends (monthly)
- Regional scan distribution
- Counterfeit alerts
- Batch information

**Features:**
- Live data from Supabase
- Smart caching (2-10 min)
- Loading skeletons
- Empty states
- Error handling
- Responsive charts

### 5. User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Consumer** | Verify medicines, view results |
| **Manufacturer** | Register medicines, generate QR codes |
| **Distributor** | Track distribution, verify batches |
| **Pharmacy** | Verify and dispense medicines |
| **DDA** | Monitor system, view analytics, manage recalls |
| **Admin** | Full system access, user management |

---

## 🔐 Security

### Multi-Layer Verification

1. **Database Check** - Verify product exists in Supabase
2. **Blockchain Verification** - Confirm immutable record
3. **Expiry Validation** - Check medicine hasn't expired
4. **QR Authentication** - One-time use, time-limited codes

### Security Features

- ✅ JWT authentication with 7-day expiry
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (100 requests/15 min)
- ✅ AES-256 encryption for sensitive data
- ✅ One-time QR codes with nonce
- ✅ 5-minute QR code expiry
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation and sanitization

---

## 📊 API Endpoints

### Public Endpoints

```bash
# Verify medicine by product ID
POST /api/verify
Body: { "productId": "MED-AUTH001" }

# Verify by QR code
POST /api/verify/qr
Body: { "qrData": "..." }

# Get medicine details
GET /api/medicines/:productId
```

### Authentication Required

```bash
# Register user
POST /api/auth/register
Body: { "email", "password", "name", "role" }

# Login
POST /api/auth/login
Body: { "email", "password" }

# Get profile
GET /api/users/profile
Headers: { "Authorization": "Bearer <token>" }
```

### Manufacturer Only

```bash
# Register medicine
POST /api/medicines/register
Headers: { "Authorization": "Bearer <token>" }
Body: { "name", "manufacturer", "batchNumber", ... }

# Generate QR code
GET /api/medicines/:productId/qr
Headers: { "Authorization": "Bearer <token>" }
```

### Admin/DDA Only

```bash
# Get system statistics
GET /api/analytics/stats
Headers: { "Authorization": "Bearer <token>" }

# Get verification trends
GET /api/analytics/verifications
Headers: { "Authorization": "Bearer <token>" }

# List users
GET /api/users
Headers: { "Authorization": "Bearer <token>" }
```

---

## 🗄️ Database Schema

### Tables

**users**
- id (uuid, primary key)
- email (text, unique)
- name (text)
- role (text)
- created_at (timestamp)

**medicines**
- product_id (text, primary key)
- name (text)
- manufacturer (text)
- batch_number (text)
- manufacture_date (date)
- expiry_date (date)
- description (text)
- blockchain_tx (text)
- registered_by (uuid, foreign key)
- created_at (timestamp)

**qr_records**
- qr_hash (text, primary key)
- product_id (text, foreign key)
- expires_at (timestamp)
- used (boolean)
- used_at (timestamp)
- created_at (timestamp)

**verification_logs**
- id (uuid, primary key)
- product_id (text)
- is_valid (boolean)
- status (text)
- verified_at (timestamp)
- ip_address (text)
- metadata (jsonb)

---

## 🧪 Testing

### Test Counterfeit Detection

```bash
# Using curl
curl -X POST http://localhost:5000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"productId":"MED-FAKE9999"}'

# Expected: status="COUNTERFEIT"
```

### Test Frontend

1. Open http://localhost:8080
2. Navigate to "Verify Medicine"
3. Enter: `MED-FAKE9999`
4. Click "Verify"
5. Expected: Red alert showing COUNTERFEIT status

### Run Unit Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Smart contract tests
cd blockchain
npm test
```

---

## 📦 Project Structure

```
sahi_aaushadhi/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── auth/              # Supabase authentication
│   │   ├── blockchain/        # Blockchain integration
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── database/          # Database schemas & policies
│   │   ├── middleware/        # Auth, validation, errors
│   │   ├── qr/                # QR generation & verification
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Input validation
│   │   └── server.ts          # Express app entry point
│   ├── logs/                  # Application logs
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── chatbot/       # AI chatbot components
│   │   │   ├── ui/            # ShadCN UI components
│   │   │   ├── QRScanner.tsx  # QR code scanner
│   │   │   ├── EmptyState.tsx # Empty state component
│   │   │   └── DashboardSkeleton.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── integrations/      # Supabase client
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Page components
│   │   │   ├── Landing.tsx    # Landing page
│   │   │   ├── Verify.tsx     # Verification page
│   │   │   ├── Dashboard.tsx  # Analytics dashboard
│   │   │   └── DDAView.tsx    # DDA admin panel
│   │   ├── services/          # API services
│   │   │   ├── analytics.service.ts
│   │   │   └── knowledgeBase.service.ts
│   │   ├── styles/            # Global styles
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── .env                   # Environment variables
│   └── package.json
│
├── blockchain/                 # Smart contracts
│   ├── contracts/             # Solidity contracts
│   │   └── MedicineVerification.sol
│   ├── scripts/               # Deployment scripts
│   ├── test/                  # Contract tests
│   ├── typechain-types/       # Generated TypeScript types
│   └── hardhat.config.ts
│
├── supabase/                   # Database
│   ├── migrations/            # SQL migration files
│   ├── qr-codes/              # QR code generator
│   │   ├── batch-format-qr-codes/  # Generated QR codes
│   │   ├── generate-medicine-qr-codes.js
│   │   ├── insert-medicines.sql
│   │   └── package.json
│   └── config.toml
│
├── chatbot/                    # Standalone chatbot (optional)
│   ├── backend/               # Chatbot backend
│   ├── chatbot/               # Chatbot UI
│   └── knowledge-base/        # Q&A data
│
└── docs/                       # Documentation
    ├── architecture.md
    └── screenshots/
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Update all environment variables with production values
- [ ] Change JWT_SECRET to strong random value
- [ ] Update ENCRYPTION_KEY to secure 32-character key
- [ ] Deploy smart contract to mainnet/testnet
- [ ] Configure production Supabase instance
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Perform security audit
- [ ] Load testing
- [ ] Documentation review

### Deployment Options

**Frontend:**
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Backend:**
- Railway (recommended)
- Heroku
- AWS EC2/ECS
- DigitalOcean

**Blockchain:**
- Ethereum Mainnet
- Polygon
- Binance Smart Chain
- Sepolia Testnet (testing)

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
cd backend
npm install
npm run dev
```

**Frontend won't start:**
```bash
cd frontend
npm install
npm run dev
```

**Database connection failed:**
- Verify Supabase URL and keys in `.env`
- Run SQL fix: `ALTER TABLE users ADD COLUMN name TEXT;`
- Check Supabase project is active

**Contract not deployed:**
- Ensure Ganache is running on port 7545
- Verify contract address in `.env`
- Redeploy if needed: `cd blockchain && npx hardhat run scripts/deploy.ts --network ganache`

**QR Scanner not working:**
- Ensure HTTPS (or localhost for development)
- Grant camera permissions in browser
- Check camera is not in use by another app

---

## 📚 Documentation

- **Architecture**: `backend/ARCHITECTURE.md`
- **Verification System**: `VERIFICATION_SYSTEM_GUIDE.md`
- **Supabase Integration**: `backend/SUPABASE_INTEGRATION.md`
- **QR Scanner**: `QR_SCANNER_IMPLEMENTATION.md`
- **Chatbot**: `CHATBOT_INTEGRATION.md`
- **QR Codes**: `QR_BATCH_FORMAT_COMPLETE.md`

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**Developed by:** Senior Product Engineer & UI/UX Architect  
**Date:** February 2026  
**Version:** 1.0.0  
**Status:** Production Ready

---

## 🙏 Acknowledgments

- Nepal Department of Drug Administration (DDA)
- Pharmaceutical manufacturers in Nepal
- Open-source community
- Supabase team
- Ethereum Foundation

---

## 📞 Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

---

## 🎯 Roadmap

### Phase 1 (Complete) ✅
- [x] Core verification system
- [x] QR code generation
- [x] Blockchain integration
- [x] Dashboard with real data
- [x] AI chatbot assistant
- [x] Mobile-responsive design

### Phase 2 (Planned)
- [ ] Mobile app (React Native)
- [ ] Offline verification mode
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Recall management system
- [ ] Integration with DDA systems

### Phase 3 (Future)
- [ ] Machine learning for fraud detection
- [ ] Supply chain tracking
- [ ] Patient medication history
- [ ] Pharmacy inventory management
- [ ] Regulatory compliance automation

---

**Built with ❤️ for a safer Nepal**

