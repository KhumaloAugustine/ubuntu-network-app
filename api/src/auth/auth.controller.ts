import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';

/**
 * Authentication controller
 * Handles HTTP requests for authentication endpoints
 * Following SOLID: Single Responsibility - handles HTTP layer only
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Request OTP for phone number verification
   * @param requestOtpDto - Contains phone number
   * @returns Success message indicating OTP was sent
   */
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    try {
      return await this.authService.requestOtp(requestOtpDto.phone);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send OTP',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Verify OTP and authenticate user
   * @param verifyOtpDto - Contains phone, OTP code, and optional device ID
   * @returns Authentication token and user data
   */
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      return await this.authService.verifyOtp(
        verifyOtpDto.phone,
        verifyOtpDto.otp,
        verifyOtpDto.deviceId
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'OTP verification failed',
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
