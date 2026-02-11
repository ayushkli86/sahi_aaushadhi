# Counterfeit Medicine Blockchain

A comprehensive blockchain-based solution for tracking and verifying pharmaceutical products to combat counterfeit medicines.

## Project Structure

```
counterfeit-medicine-blockchain/
├── frontend/          # React + Vite application
├── blockchain/        # Hardhat smart contracts
├── backend/           # Future API layer
├── supabase/          # Database configuration
└── docs/              # Documentation
```

## Features

- Medicine registration on blockchain
- QR code-based verification
- Real-time dashboard for stakeholders
- DDA (Drug Distribution Authority) monitoring panel
- Immutable audit trail

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- ethers.js for blockchain interaction
- React Router for navigation
- Supabase for authentication

### Blockchain
- Solidity ^0.8.24
- Hardhat development environment
- OpenZeppelin contracts
- Local and testnet deployment support

### Database
- Supabase (PostgreSQL)
- Real-time subscriptions
- Row-level security

## Getting Started

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Bun or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd counterfeit-medicine-blockchain
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install blockchain dependencies
```bash
cd ../blockchain
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

#### Start Blockchain Node
```bash
cd blockchain
npm run node
```

#### Deploy Contracts
```bash
cd blockchain
npm run deploy
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm test         # Run tests
```

### Blockchain Development
```bash
cd blockchain
npm run compile  # Compile contracts
npm test         # Run contract tests
npm run deploy   # Deploy to network
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Smart Contract Tests
```bash
cd blockchain
npm test
```

## Deployment

### Frontend
Build and deploy to your hosting provider:
```bash
cd frontend
npm run build
```

### Smart Contracts
Deploy to testnet or mainnet:
```bash
cd blockchain
npm run deploy -- --network <network-name>
```

## Documentation

See the `/docs` folder for:
- Architecture diagrams
- ER diagrams
- API documentation
- User guides

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
