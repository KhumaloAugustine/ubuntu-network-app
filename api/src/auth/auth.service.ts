import { Injectable } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import { SmsService } from './services/sms.service';
import * as crypto from 'crypto';

/**
 * Authentication service
 * Business logic for authentication flows
 * Following SOLID: Single Responsibility - handles auth business logic
 * Following DRY: Reusable authentication methods
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly smsService: SmsService
  ) {}

  /**
   * Request OTP for phone verification
   * @param phone - Phone number in international format (+27...)
   * @returns Success response with phone number
   */
  async requestOtp(phone: string) {
    // Validate phone format (South Africa +27)
    if (!this.isValidSouthAfricanPhone(phone)) {
      throw new Error('Invalid South African phone number format. Use +27...');
    }

    // Generate and store OTP
    const otp = this.otpService.generateOtp(phone);

    // Send OTP via SMS
    await this.smsService.sendOtp(phone, otp);

    return {
      success: true,
      message: 'OTP sent successfully',
      phone,
    };
  }

  /**
   * Verify OTP and create session
   * @param phone - Phone number
   * @param otp - OTP code
   * @param deviceId - Optional device identifier for binding
   * @returns Authentication token and user data
   */
  async verifyOtp(phone: string, otp: string, deviceId?: string) {
    // Verify OTP
    const isValid = this.otpService.verifyOtp(phone, otp);
    
    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }

    // TODO: Replace with actual database user lookup/creation
    // This is a placeholder - in production, find or create user in DB
    const userId = crypto.randomUUID();

    // Generate session token
    const token = this.generateSessionToken(userId, deviceId);

    // Clean up used OTP
    this.otpService.clearOtp(phone);

    return {
      success: true,
      token,
      user: {
        userId,
        phone,
        // TODO: Add tier, verificationStatus, etc. from DB
      },
    };
  }

  /**
   * Validate South African phone number format
   * @param phone - Phone number to validate
   * @returns True if valid
   */
  private isValidSouthAfricanPhone(phone: string): boolean {
    // South Africa: +27 followed by 9 digits
    const saPhoneRegex = /^\+27\d{9}$/;
    return saPhoneRegex.test(phone);
  }

  /**
   * Generate session token
   * @param userId - User ID
   * @param deviceId - Optional device ID for binding
   * @returns Session token
   */
  private generateSessionToken(userId: string, deviceId?: string): string {
    // TODO: Implement proper JWT or session token generation
    // For now, return a simple token (replace in production)
    const payload = { userId, deviceId, timestamp: Date.now() };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}
