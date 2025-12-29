import { IsPhoneNumber, IsString, Length } from 'class-validator';

/**
 * Request OTP DTO
 * Validates phone number format for South African numbers
 */
export class RequestOtpDTO {
  @IsString()
  phone: string;
}

/**
 * Verify OTP DTO
 * Validates OTP code and device binding
 */
export class VerifyOtpDTO {
  @IsString()
  phone: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp: string;

  @IsString()
  deviceId: string;
}

/**
 * Auth response DTO
 */
export class AuthResponseDTO {
  token: string;
  user: {
    id: string;
    phone: string;
    displayName: string;
    tier: number;
  };
  expiresIn: string;
}
