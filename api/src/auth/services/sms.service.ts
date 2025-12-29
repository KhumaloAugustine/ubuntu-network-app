import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

/**
 * SMS service - handles sending SMS via Twilio
 * Following SOLID: Single Responsibility - SMS delivery only
 * Following Dependency Inversion: Can be swapped with other SMS providers
 */
@Injectable()
export class SmsService {
  private twilioClient: twilio.Twilio | null = null;
  private fromNumber: string | undefined;

  constructor(private readonly configService: ConfigService) {
    // Initialize Twilio client if credentials are available
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    // Only initialize if credentials look valid (avoid startup crash)
    if (accountSid && authToken && accountSid.startsWith('AC') && authToken.length > 10) {
      this.twilioClient = twilio(accountSid, authToken);
    }
  }

  /**
   * Send OTP via SMS
   * @param phone - Recipient phone number
   * @param otp - OTP code to send
   */
  async sendOtp(phone: string, otp: string): Promise<void> {
    const message = `Your Ubuntu Network verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;

    // If Twilio is configured, send real SMS
    if (this.twilioClient && this.fromNumber) {
      try {
        await this.twilioClient.messages.create({
          body: message,
          from: this.fromNumber,
          to: phone,
        });
        console.log(`✓ SMS sent to ${phone}`);
      } catch (error) {
        console.error(`✗ Failed to send SMS to ${phone}:`, error.message);
        throw new Error('Failed to send SMS. Please try again.');
      }
    } else {
      // Development mode - log OTP instead of sending
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📱 DEBUG MODE - OTP for ${phone}`);
      console.log(`🔑 OTP: ${otp}`);
      console.log(`⚠️  Configure TWILIO_* env vars for real SMS`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  }

  /**
   * Check if Twilio is properly configured
   * @returns True if configured
   */
  isConfigured(): boolean {
    return this.twilioClient !== null && !!this.fromNumber;
  }
}
