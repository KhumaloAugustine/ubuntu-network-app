import { Injectable } from '@nestjs/common';
import { ValidationException } from '../../common/exceptions/base.exception';

/**
 * OTP Service
 * Implements Single Responsibility: manages OTP generation and validation
 * Depends on abstraction (injected strategies), not concrete implementations (DIP)
 */
@Injectable()
export class OtpService {
  private otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_ATTEMPTS = 3;

  /**
   * Generate and store OTP
   * @param phone Phone number
   * @returns OTP code
   */
  generateOtp(phone: string): string {
    const otp = this.randomOtp();
    const expiresAt = Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000;

    this.otpStore.set(phone, {
      otp,
      expiresAt,
      attempts: 0,
    });

    // Debug logging (remove in production)
    console.log(`[DEV] OTP for ${phone}: ${otp}`);

    return otp;
  }

  /**
   * Verify OTP code
   * @param phone Phone number
   * @param otp Code to verify
   * @throws ValidationException if OTP invalid or expired
   */
  verifyOtp(phone: string, otp: string): void {
    const entry = this.otpStore.get(phone);

    if (!entry) {
      throw new ValidationException('OTP not found. Request a new OTP.', { field: 'otp' });
    }

    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(phone);
      throw new ValidationException('OTP expired. Request a new OTP.', { field: 'otp' });
    }

    if (entry.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(phone);
      throw new ValidationException('Too many failed attempts. Request a new OTP.', { field: 'otp' });
    }

    if (entry.otp !== otp) {
      entry.attempts++;
      throw new ValidationException('OTP is invalid.', { field: 'otp' });
    }

    // Clean up
    this.otpStore.delete(phone);
  }

  /**
   * Check if OTP exists and is not expired (without validation)
   */
  hasValidOtp(phone: string): boolean {
    const entry = this.otpStore.get(phone);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(phone);
      return false;
    }
    return true;
  }

  /**
   * Generate random 6-digit OTP
   */
  private randomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
