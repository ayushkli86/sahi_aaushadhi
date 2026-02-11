import qrService from './qr.service';
import blockchainService from './blockchain.service';
import databaseService from './database.service';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

interface VerificationResult {
  isValid: boolean;
  isExpired: boolean;
  medicine: any;
  message: string;
  blockchainVerified: boolean;
}

class VerificationService {
  /**
   * MAIN VERIFICATION FLOW
   * This orchestrates the entire verification process
   */
  async verifyMedicine(productId: string, ipAddress?: string): Promise<VerificationResult> {
    try {
      logger.info(`Starting verification for product: ${productId}`);

      // STEP 1: Get medicine from database
      const medicine = await databaseService.getMedicineByProductId(productId);
      
      if (!medicine) {
        await this.logVerification(productId, false, ipAddress);
        return {
          isValid: false,
          isExpired: false,
          medicine: null,
          message: 'Medicine not found in database',
          blockchainVerified: false
        };
      }

      // STEP 2: Verify on blockchain
      let blockchainVerified = false;
      let blockchainData = null;

      try {
        blockchainData = await blockchainService.verifyMedicine(productId);
        blockchainVerified = blockchainData.exists && blockchainData.isVerified;
      } catch (error) {
        logger.warn(`Blockchain verification failed for ${productId}`, error);
        // Continue even if blockchain fails - log it
      }

      // STEP 3: Check expiry
      const isExpired = new Date(medicine.expiry_date) < new Date();

      // STEP 4: Determine validity
      const isValid = blockchainVerified && !isExpired;

      // STEP 5: Log verification attempt
      await this.logVerification(productId, isValid, ipAddress, {
        blockchainVerified,
        isExpired
      });

      logger.info(`Verification complete for ${productId}: ${isValid ? 'VALID' : 'INVALID'}`);

      return {
        isValid,
        isExpired,
        medicine: {
          ...medicine,
          blockchain: blockchainData
        },
        message: this.getVerificationMessage(isValid, isExpired, blockchainVerified),
        blockchainVerified
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
          isExpired: true,
          medicine: null,
          message: 'QR code has expired. Please generate a new one.',
          blockchainVerified: false
        };
      }

      // STEP 4: Check if QR hash exists in database (one-time use)
      const qrRecord = await databaseService.getQRRecord(qrHash);
      
      if (!qrRecord) {
        await this.logVerification(productId, false, ipAddress, { reason: 'QR not found' });
        return {
          isValid: false,
          isExpired: false,
          medicine: null,
          message: 'Invalid or already used QR code',
          blockchainVerified: false
        };
      }

      if (qrRecord.used) {
        await this.logVerification(productId, false, ipAddress, { reason: 'QR already used' });
        return {
          isValid: false,
          isExpired: false,
          medicine: null,
          message: 'QR code has already been used',
          blockchainVerified: false
        };
      }

      // STEP 5: Verify the medicine itself
      const result = await this.verifyMedicine(productId, ipAddress);

      // STEP 6: Mark QR as used if verification successful
      if (result.isValid) {
        await databaseService.markQRAsUsed(qrHash);
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
    isValid: boolean,
    isExpired: boolean,
    blockchainVerified: boolean
  ): string {
    if (!blockchainVerified) {
      return 'Medicine not found on blockchain - possible counterfeit';
    }
    if (isExpired) {
      return 'Medicine is expired - do not use';
    }
    if (isValid) {
      return 'Medicine is authentic and safe to use';
    }
    return 'Verification failed - do not use this medicine';
  }
}

export default new VerificationService();
