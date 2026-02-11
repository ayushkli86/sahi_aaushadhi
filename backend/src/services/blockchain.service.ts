import { ethers } from 'ethers';
import logger from '../utils/logger';
import { AppError } from '../utils/AppError';

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
  }

  async initializeContract(abi: any[]) {
    try {
      this.contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS!,
        abi,
        this.wallet
      );
      logger.info('Blockchain contract initialized');
    } catch (error) {
      logger.error('Failed to initialize contract', error);
      throw new AppError('Blockchain initialization failed', 500);
    }
  }

  async registerMedicine(
    productId: string,
    name: string,
    manufacturer: string,
    manufactureDate: number,
    expiryDate: number
  ) {
    if (!this.contract) {
      throw new AppError('Contract not initialized', 500);
    }

    try {
      const tx = await this.contract.registerMedicine(
        productId,
        name,
        manufacturer,
        manufactureDate,
        expiryDate
      );
      const receipt = await tx.wait();
      
      logger.info(`Medicine registered on blockchain: ${productId}`);
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        productId
      };
    } catch (error: any) {
      logger.error('Blockchain registration failed', error);
      throw new AppError(error.message || 'Failed to register on blockchain', 500);
    }
  }

  async verifyMedicine(productId: string) {
    if (!this.contract) {
      throw new AppError('Contract not initialized', 500);
    }

    try {
      const result = await this.contract.verifyMedicine(productId);
      
      return {
        exists: result.exists,
        name: result.name,
        manufacturer: result.manufacturer,
        manufactureDate: Number(result.manufactureDate),
        expiryDate: Number(result.expiryDate),
        isVerified: result.isVerified
      };
    } catch (error: any) {
      logger.error('Blockchain verification failed', error);
      throw new AppError('Product not found on blockchain', 404);
    }
  }

  async getMedicineDetails(productId: string) {
    if (!this.contract) {
      throw new AppError('Contract not initialized', 500);
    }

    try {
      const medicine = await this.contract.getMedicine(productId);
      
      return {
        productId: medicine.productId,
        name: medicine.name,
        manufacturer: medicine.manufacturer,
        manufactureDate: Number(medicine.manufactureDate),
        expiryDate: Number(medicine.expiryDate),
        registeredBy: medicine.registeredBy,
        isVerified: medicine.isVerified
      };
    } catch (error: any) {
      logger.error('Failed to get medicine details', error);
      throw new AppError('Product not found', 404);
    }
  }

  /**
   * Register QR hash on blockchain
   * This creates tamper-proof record of QR code
   */
  async registerQRHash(qrHash: string, productId: string) {
    if (!this.contract) {
      throw new AppError('Contract not initialized', 500);
    }

    try {
      // Convert hash to bytes32 format for Solidity
      const hashBytes = '0x' + qrHash;
      
      const tx = await this.contract.registerQR(hashBytes, productId);
      const receipt = await tx.wait();
      
      logger.info(`QR hash registered on blockchain: ${qrHash}`);
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error: any) {
      logger.error('QR hash registration failed', error);
      throw new AppError(error.message || 'Failed to register QR on blockchain', 500);
    }
  }

  /**
   * Verify QR hash exists on blockchain
   */
  async verifyQRHash(qrHash: string): Promise<boolean> {
    if (!this.contract) {
      throw new AppError('Contract not initialized', 500);
    }

    try {
      const hashBytes = '0x' + qrHash;
      const isValid = await this.contract.verifyQR(hashBytes);
      return isValid;
    } catch (error: any) {
      logger.error('QR hash verification failed', error);
      return false;
    }
  }
}

export default new BlockchainService();
