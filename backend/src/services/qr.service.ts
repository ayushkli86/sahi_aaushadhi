import QRCode from 'qrcode';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

interface QRPayload {
  qrHash: string;
  productId: string;
  nonce: string;
  timestamp: number;
  expiresAt: number;
}

class QRService {
  private QR_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

  /**
   * Generate a unique QR hash for a medicine product
   * This hash will be stored in DB and blockchain
   */
  generateQRHash(productId: string, nonce: string, timestamp: number): string {
    const data = `${productId}:${nonce}:${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Create QR payload with one-time nonce
   * This prevents replay attacks
   */
  async createQRPayload(productId: string): Promise<QRPayload> {
    const nonce = uuidv4();
    const timestamp = Date.now();
    const expiresAt = timestamp + this.QR_EXPIRY_TIME;
    const qrHash = this.generateQRHash(productId, nonce, timestamp);

    return {
      qrHash,
      productId,
      nonce,
      timestamp,
      expiresAt
    };
  }

  /**
   * Generate QR code image from payload
   * Only hash is encoded - no sensitive data
   */
  async generateQRImage(payload: QRPayload): Promise<string> {
    try {
      // Only encode the hash and product ID
      const qrData = JSON.stringify({
        h: payload.qrHash,
        p: payload.productId,
        t: payload.timestamp
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      logger.info(`QR image generated for product: ${payload.productId}`);
      return qrCodeDataURL;
    } catch (error) {
      logger.error('QR image generation failed', error);
      throw new AppError('Failed to generate QR code image', 500);
    }
  }

  /**
   * Parse scanned QR code data
   */
  parseQRData(qrData: string): { qrHash: string; productId: string; timestamp: number } {
    try {
      const parsed = JSON.parse(qrData);
      
      if (!parsed.h || !parsed.p || !parsed.t) {
        throw new Error('Invalid QR format');
      }

      return {
        qrHash: parsed.h,
        productId: parsed.p,
        timestamp: parsed.t
      };
    } catch (error) {
      logger.error('QR parsing failed', error);
      throw new AppError('Invalid QR code format', 400);
    }
  }

  /**
   * Check if QR code is expired
   */
  isQRExpired(timestamp: number): boolean {
    return Date.now() > (timestamp + this.QR_EXPIRY_TIME);
  }

  /**
   * Verify QR hash matches expected format
   */
  isValidHash(hash: string): boolean {
    return /^[a-f0-9]{64}$/.test(hash);
  }
}

export default new QRService();
