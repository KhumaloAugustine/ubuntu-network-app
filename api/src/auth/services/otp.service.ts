import { Injectable } from '@nestjs/common';

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

/**
 * OTP service - manages OTP generation, storage, and verification
 * Following SOLID: Single Responsibility - handles OTP logic only
 * Following DRY: Reusable OTP operations
 */
@Injectable()
export class OtpService {
  private readonly otpStore = new Map<string, OtpEntry>();
  private readonly OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ATTEMPTS = 3;

  /**
   * Generate a 6-digit OTP and store it
   * @param phone - Phone number
   * @returns Generated OTP
   */
  generateOtp(phone: string): string {
    const otp = this.createRandomOtp();
    const expiresAt = Date.now() + this.OTP_EXPIRY_MS;

    this.otpStore.set(phone, {
      otp,
      expiresAt,
      attempts: 0,
    });

    // Schedule cleanup after expiry
    setTimeout(() => this.clearOtp(phone), this.OTP_EXPIRY_MS);

    return otp;
  }

  /**
   * Verify an OTP
   * @param phone - Phone number
   * @param otp - OTP to verify
   * @returns True if valid
   */
  verifyOtp(phone: string, otp: string): boolean {
    const entry = this.otpStore.get(phone);

    if (!entry) {
      return false;
    }

    // Check expiry
    if (Date.now() > entry.expiresAt) {
      this.clearOtp(phone);
      return false;
    }

    // Check attempts
    if (entry.attempts >= this.MAX_ATTEMPTS) {
      this.clearOtp(phone);
      return false;
    }

    // Increment attempts
    entry.attempts++;

    // Verify OTP
    if (entry.otp !== otp) {
      return false;
    }

    return true;
  }

  /**
   * Clear OTP for a phone number
   * @param phone - Phone number
   */
  clearOtp(phone: string): void {
    this.otpStore.delete(phone);
  }

  /**
   * Create a random 6-digit OTP
   * @returns 6-digit OTP string
   */
  private createRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
