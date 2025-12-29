import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../database/entities/user.entity';

/**
 * JWT Strategy for Passport
 * Implements DIP: depends on AuthService abstraction
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'ubuntu-network-secret'),
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    return this.authService.validateUser(payload);
  }
}
