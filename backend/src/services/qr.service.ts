import QRCode from 'qrcode';
import crypto from 'crypto';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

class QRService {
  private algorithm = 'aes-256-cbc';
  private key = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32));
  private iv = crypto.randomBytes(16);

  encryptData(data: string): string {
    try {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return `${this.iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      logger.error('Encryption failed', error);
      throw new AppError('Failed to encrypt data', 500);
    }
  }

  decryptData(encryptedData: string): string {
    try {
      const parts = encryptedData.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      logger.error('Decryption failed', error);
      throw new AppError('Invalid QR code data', 400);
    }
  }

  async generateQRCode(productId: string, medicineData: any): Promise<string> {
    try {
      const data = JSON.stringify({
        productId,
        name: medicineData.name,
        manufacturer: medicineData.manufacturer,
        timestamp: Date.now()
      });

      const encrypted = this.encryptData(data);
      const qrCodeDataURL = await QRCode.toDataURL(encrypted, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2
      });

      logger.info(`QR code generated for product: ${productId}`);
      return qrCodeDataURL;
    } catch (error) {
      logger.error('QR generation failed', error);
      throw new AppError('Failed to generate QR code', 500);
    }
  }

  parseQRCode(qrData: string): any {
    try {
      const decrypted = this.decryptData(qrData);
      return JSON.parse(decrypted);
    } catch (error) {
      logger.error('QR parsing failed', error);
      throw new AppError('Invalid QR code', 400);
    }
  }
}

export default new QRService();
