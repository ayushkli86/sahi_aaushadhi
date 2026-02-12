import qrService from './qr.service';
import blockchainService from './blockchain.service';
import databaseService from './database.service';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

interface VerificationResult {
  isValid: boolean;
  status: 'AUTHENTIC' | 'COUNTERFEIT' | 'EXPIRED' | 'SUSPICIOUS' | 'NOT_FOUND';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  isExpired: boolean;
  medicine: any;
  message: string;
  blockchainVerified: boolean;
  checks: {
    databaseFound: boolean;
    blockchainVerified: boolean;
    notExpired: boolean;
    qrValid?: boolean;
    qrNotUsed?: boolean;
  };
  warnings: string[];
}

class VerificationService {
  /**
   * MAIN VERIFICATION FLOW
   * This orchestrates the entire verification process
   */
  async verifyMedicine(productId: string, ipAddress?: string): Promise<VerificationResult> {
    try {
      logger.info(`Starting verification for product: ${productId}`);

      const warnings: string[] = [];
      const checks = {
        databaseFound: false,
        blockchainVerified: false,
        notExpired: false
      };

      // STEP 1: Get medicine from database
      const medicine = await databaseService.getMedicineByProductId(productId);
      
      if (!medicine) {
        await this.logVerification(productId, false, ipAddress, { reason: 'Not found in database' });
        return {
          isValid: false,
          status: 'NOT_FOUND',
          confidence: 'HIGH',
          isExpired: false,
          medicine: null,
          message: '⚠️ COUNTERFEIT ALERT: This medicine is not registered in our system',
          blockchainVerified: false,
          checks,
          warnings: ['Product ID not found in database', 'This could be a counterfeit product']
        };
      }

      checks.databaseFound = true;

      // STEP 2: Verify on blockchain
      let blockchainVerified = false;
      let blockchainData = null;

      try {
        // Development mode: Skip actual blockchain verification if blockchain_tx exists
        // This allows testing without Ganache running
        if (medicine.blockchain_tx && process.env.NODE_ENV === 'development') {
          logger.info(`Using development mode blockchain verification for ${productId}`);
          blockchainVerified = true;
          checks.blockchainVerified = true;
          blockchainData = {
            exists: true,
            isVerified: true,
            name: medicine.name,
            manufacturer: medicine.manufacturer,
            manufactureDate: Math.floor(new Date(medicine.manufacture_date).getTime() / 1000),
            expiryDate: Math.floor(new Date(medicine.expiry_date).getTime() / 1000)
          };
        } else {
          // Production mode: Actual blockchain verification
          blockchainData = await blockchainService.verifyMedicine(productId);
          blockchainVerified = blockchainData.exists && blockchainData.isVerified;
          checks.blockchainVerified = blockchainVerified;

          if (!blockchainVerified) {
            warnings.push('Blockchain verification failed');
            warnings.push('This medicine may be counterfeit');
          }
        }
      } catch (error) {
        logger.warn(`Blockchain verification failed for ${productId}`, error);
        warnings.push('Unable to verify on blockchain');
        warnings.push('Treat this product with caution');
      }

      // STEP 3: Check expiry
      const isExpired = new Date(medicine.expiry_date) < new Date();
      checks.notExpired = !isExpired;

      if (isExpired) {
        warnings.push(`Expired on ${new Date(medicine.expiry_date).toLocaleDateString()}`);
        warnings.push('Do not consume expired medicine');
      }

      // STEP 4: Determine status and validity
      let status: 'AUTHENTIC' | 'COUNTERFEIT' | 'EXPIRED' | 'SUSPICIOUS';
      let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
      let isValid = false;

      if (checks.databaseFound && checks.blockchainVerified && checks.notExpired) {
        status = 'AUTHENTIC';
        confidence = 'HIGH';
        isValid = true;
      } else if (isExpired && checks.blockchainVerified) {
        status = 'EXPIRED';
        confidence = 'HIGH';
        isValid = false;
      } else if (!checks.blockchainVerified && checks.databaseFound) {
        status = 'SUSPICIOUS';
        confidence = 'MEDIUM';
        isValid = false;
      } else {
        status = 'COUNTERFEIT';
        confidence = 'HIGH';
        isValid = false;
      }

      // STEP 5: Log verification attempt
      await this.logVerification(productId, isValid, ipAddress, {
        status,
        confidence,
        checks,
        warningCount: warnings.length
      });

      logger.info(`Verification complete for ${productId}: ${status} (${confidence} confidence)`);

      return {
        isValid,
        status,
        confidence,
        isExpired,
        medicine: {
          ...medicine,
          blockchain: blockchainData
        },
        message: this.getVerificationMessage(status, isExpired, blockchainVerified),
        blockchainVerified,
        checks,
        warnings
      };
    } catch (error) {
      logger.error('Verification service error', error);
      throw error;
    }
  }

  /**
   * VERIFY BY QR CODE
   * This handles QR-based verification with additional security
   */
  async verifyByQR(qrData: string, ipAddress?: string): Promise<VerificationResult> {
    try {
      // STEP 1: Parse QR data
      const parsed = qrService.parseQRData(qrData);
      const { qrHash, productId, timestamp } = parsed;

      // STEP 2: Validate QR hash format
      if (!qrService.isValidHash(qrHash)) {
        throw new AppError('Invalid QR hash format', 400);
      }

      // STEP 3: Check if QR is expired
      if (qrService.isQRExpired(timestamp)) {
        await this.logVerification(productId, false, ipAddress, { reason: 'QR expired' });
        return {
          isValid: false,
          status: 'SUSPICIOUS',
          confidence: 'HIGH',
          isExpired: true,
          medicine: null,
          message: '⚠️ QR CODE EXPIRED: This QR code has expired. Request a new one from the manufacturer.',
          blockchainVerified: false,
          checks: {
            databaseFound: false,
            blockchainVerified: false,
            notExpired: false,
            qrValid: false
          },
          warnings: ['QR code expired (5 minute limit)', 'This could indicate tampering']
        };
      }

      // STEP 4: Check if QR hash exists in database (one-time use)
      const qrRecord = await databaseService.getQRRecord(qrHash);
      
      if (!qrRecord) {
        await this.logVerification(productId, false, ipAddress, { reason: 'QR not found' });
        return {
          isValid: false,
          status: 'COUNTERFEIT',
          confidence: 'HIGH',
          isExpired: false,
          medicine: null,
          message: '🚨 COUNTERFEIT ALERT: Invalid QR code - not registered in our system',
          blockchainVerified: false,
          checks: {
            databaseFound: false,
            blockchainVerified: false,
            notExpired: false,
            qrValid: false
          },
          warnings: ['QR code not found in database', 'This is likely a fake/counterfeit product', 'Do not purchase or consume']
        };
      }

      if (qrRecord.used) {
        await this.logVerification(productId, false, ipAddress, { reason: 'QR already used' });
        return {
          isValid: false,
          status: 'SUSPICIOUS',
          confidence: 'HIGH',
          isExpired: false,
          medicine: null,
          message: '⚠️ SECURITY ALERT: This QR code has already been scanned',
          blockchainVerified: false,
          checks: {
            databaseFound: true,
            blockchainVerified: false,
            notExpired: false,
            qrValid: true,
            qrNotUsed: false
          },
          warnings: [
            'QR code already used',
            'Each QR code can only be scanned once',
            'This could indicate product duplication or tampering',
            'Contact manufacturer if you believe this is an error'
          ]
        };
      }

      // STEP 5: Verify QR hash on blockchain
      const qrBlockchainValid = await blockchainService.verifyQRHash(qrHash);
      
      if (!qrBlockchainValid) {
        await this.logVerification(productId, false, ipAddress, { reason: 'QR not on blockchain' });
        return {
          isValid: false,
          status: 'COUNTERFEIT',
          confidence: 'HIGH',
          isExpired: false,
          medicine: null,
          message: '🚨 COUNTERFEIT ALERT: QR code not verified on blockchain',
          blockchainVerified: false,
          checks: {
            databaseFound: true,
            blockchainVerified: false,
            notExpired: false,
            qrValid: true,
            qrNotUsed: true
          },
          warnings: ['QR hash not found on blockchain', 'This is a counterfeit product', 'Do not purchase or consume']
        };
      }

      // STEP 6: Verify the medicine itself
      const result = await this.verifyMedicine(productId, ipAddress);

      // Add QR-specific checks
      result.checks.qrValid = true;
      result.checks.qrNotUsed = true;

      // STEP 7: Mark QR as used if verification successful
      if (result.isValid) {
        await databaseService.markQRAsUsed(qrHash);
        result.message = '✅ AUTHENTIC: This medicine is genuine and safe to use';
      }

      return result;
    } catch (error) {
      logger.error('QR verification error', error);
      throw error;
    }
  }

  /**
   * Log verification attempt for audit trail
   */
  private async logVerification(
    productId: string,
    isValid: boolean,
    ipAddress?: string,
    metadata?: any
  ): Promise<void> {
    try {
      await databaseService.logVerification({
        product_id: productId,
        is_valid: isValid,
        verified_at: new Date().toISOString(),
        ip_address: ipAddress,
        metadata: metadata ? JSON.stringify(metadata) : null
      });
    } catch (error) {
      logger.error('Failed to log verification', error);
      // Don't throw - logging failure shouldn't break verification
    }
  }

  /**
   * Generate appropriate message based on verification result
   */
  private getVerificationMessage(
    status: 'AUTHENTIC' | 'COUNTERFEIT' | 'EXPIRED' | 'SUSPICIOUS',
    isExpired: boolean,
    blockchainVerified: boolean
  ): string {
    switch (status) {
      case 'AUTHENTIC':
        return '✅ AUTHENTIC: This medicine is genuine, verified on blockchain, and safe to use';
      
      case 'EXPIRED':
        return '⚠️ EXPIRED: This medicine is authentic but has expired. Do not consume.';
      
      case 'COUNTERFEIT':
        return '🚨 COUNTERFEIT ALERT: This medicine is NOT registered on blockchain. This is likely a fake product. Do not purchase or consume.';
      
      case 'SUSPICIOUS':
        return '⚠️ SUSPICIOUS: Unable to fully verify this medicine. Exercise caution and contact the manufacturer.';
      
      default:
        return '❌ VERIFICATION FAILED: Unable to verify this medicine. Do not use.';
    }
  }
}


export default new VerificationService();
