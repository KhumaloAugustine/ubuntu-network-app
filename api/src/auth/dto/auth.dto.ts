import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

/**
 * DTO for OTP request
 * Following SOLID: Single Responsibility - validates OTP request data
 */
export class RequestOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+27\d{9}$/, {
    message: 'Phone must be a valid South African number (+27XXXXXXXXX)',
  })
  phone: string;
}

/**
 * DTO for OTP verification
 * Following SOLID: Single Responsibility - validates OTP verification data
 */
export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+27\d{9}$/, {
    message: 'Phone must be a valid South African number (+27XXXXXXXXX)',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'OTP must be a 6-digit code',
  })
  otp: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}
