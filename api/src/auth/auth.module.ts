import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './services/otp.service';
import { SmsService } from './services/sms.service';

/**
 * Authentication module
 * Handles user authentication, OTP verification, and session management
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService, OtpService, SmsService],
  exports: [AuthService],
})
export class AuthModule {}
