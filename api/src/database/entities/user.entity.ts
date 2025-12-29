import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Column, Index } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum UserTier {
  BASIC = 1,
  VERIFIED_HELPER = 2,
  TRUSTED_MENTOR = 3,
  COMMUNITY_GUARDIAN = 4,
}

/**
 * User Entity
 * Implements Single Responsibility: manages user data only
 * Related business logic in UserService (DIP)
 */
@Entity('users')
@Index(['phone', 'verificationStatus'])
@Index(['tier'])
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column('varchar', { length: 20, unique: true })
  phone: string;

  @Column('varchar', { length: 255 })
  displayName: string;

  @Column('int')
  tier: UserTier = UserTier.BASIC;

  @Column('int', { default: 0 })
  vouchCount: number = 0;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  safetyRating: number = 0;

  @Column('boolean', { default: false })
  isEmailVerified: boolean = false;

  @Column('varchar', { length: 50, default: 'pending' })
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended';

  @Column('timestamp', { nullable: true })
  lastVerifiedDate: Date;

  @Column('text', { nullable: true })
  photoVerificationHash: string;

  @Column('text', { nullable: true })
  photoVerificationUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid', { nullable: true })
  createdBy: string;

  @Column('boolean', { default: false })
  isActive: boolean = true;

  /**
   * Business logic methods (Encapsulation)
   */
  canWorkWithYouth(): boolean {
    return this.tier >= UserTier.TRUSTED_MENTOR;
  }

  canVouch(): boolean {
    return this.tier >= UserTier.TRUSTED_MENTOR;
  }

  getStatusColor(): string {
    switch (this.tier) {
      case UserTier.BASIC:
        return 'green';
      case UserTier.VERIFIED_HELPER:
        return 'blue';
      case UserTier.TRUSTED_MENTOR:
        return 'gold';
      case UserTier.COMMUNITY_GUARDIAN:
        return 'purple';
      default:
        return 'gray';
    }
  }
}
