import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDTO, VerifyOtpDTO, AuthResponseDTO } from './dto/auth.dto';
import { ApiResponseDTO } from '../common/dtos/response.dto';

/**
 * Authentication Controller
 * Handles OTP and JWT flows
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Request OTP for phone number
   * POST /api/v1/auth/request-otp
   */
  @Post('request-otp')
  @HttpCode(200)
  async requestOtp(@Body() dto: RequestOtpDTO) {
    const result = await this.authService.requestOtp(dto);
    return new ApiResponseDTO(result, 'OTP sent successfully');
  }

  /**
   * Verify OTP and get JWT token
   * POST /api/v1/auth/verify-otp
   */
  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() dto: VerifyOtpDTO): Promise<ApiResponseDTO<AuthResponseDTO>> {
    const result = await this.authService.verifyOtp(dto);
    return new ApiResponseDTO(result, 'Authentication successful');
  }
}
