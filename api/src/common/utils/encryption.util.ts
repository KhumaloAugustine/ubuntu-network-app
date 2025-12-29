import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

/**
 * Encryption utility class for PII protection
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';

  /**
   * Encrypt sensitive data
   * @param text Data to encrypt
   * @param encryptionKey 32-byte key for AES-256
   * @returns Encrypted data with IV and authTag
   */
  static encrypt(text: string, encryptionKey: string): string {
    const iv = randomBytes(16);
    const key = scryptSync(encryptionKey, 'salt', 32);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();
    const combined = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;

    return combined;
  }

  /**
   * Decrypt sensitive data
   * @param encrypted Encrypted data with IV and authTag
   * @param encryptionKey 32-byte key for AES-256
   * @returns Decrypted plaintext
   */
  static decrypt(encrypted: string, encryptionKey: string): string {
    const parts = encrypted.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];

    const key = scryptSync(encryptionKey, 'salt', 32);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
