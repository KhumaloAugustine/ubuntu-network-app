import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { OtpService } from './services/otp.service';
import { AuthResponseDTO, RequestOtpDTO, VerifyOtpDTO } from './dto/auth.dto';
import { PhoneUtil } from '../../common/utils/phone.util';
import { ValidationException, NotFoundException } from '../../common/exceptions/base.exception';

/**
 * Authentication Service
 * Implements Single Responsibility: manages auth flows
 * Depends on OtpService abstraction (DIP)
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  /**
   * Request OTP for phone number
   * @param dto Request DTO with phone number
   * @returns Success message
   */
  async requestOtp(dto: RequestOtpDTO): Promise<{ success: boolean; message: string; expiresIn: number }> {
    // Validate and format phone number
    if (!PhoneUtil.isValidSouthAfricanNumber(dto.phone)) {
      throw new ValidationException('Invalid South African phone number', { field: 'phone' });
    }

    const phone = PhoneUtil.formatToInternational(dto.phone);

    // Generate OTP
    const otp = this.otpService.generateOtp(phone);

    // TODO: Send via Twilio
    // await this.smsService.sendOtp(phone, otp);

    return {
      success: true,
      message: 'OTP sent to phone number',
      expiresIn: 5 * 60, // 5 minutes in seconds
    };
  }

  /**
   * Verify OTP and issue JWT token
   * @param dto Verify DTO with phone, OTP, and device ID
   * @returns Auth token and user data
   */
  async verifyOtp(dto: VerifyOtpDTO): Promise<AuthResponseDTO> {
    const phone = PhoneUtil.formatToInternational(dto.phone);

    // Verify OTP
    this.otpService.verifyOtp(phone, dto.otp);

    // Find or create user
    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      user = this.userRepository.create({
        phone,
        displayName: `User ${phone.slice(-4)}`,
      });
      await this.userRepository.save(user);
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      phone: user.phone,
      tier: user.tier,
      deviceId: dto.deviceId,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        displayName: user.displayName,
        tier: user.tier,
      },
      expiresIn: '7d',
    };
  }

  /**
   * Validate JWT token payload
   */
  async validateUser(payload: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });

    if (!user) {
      throw new NotFoundException('User', payload.sub);
    }

    if (!user.isActive) {
      throw new ValidationException('User account is inactive');
    }

    return user;
  }
}
