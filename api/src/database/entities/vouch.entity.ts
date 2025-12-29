import { Entity, PrimaryColumn, CreateDateColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';

export enum VouchStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  PENDING = 'pending',
}

export enum RelationshipType {
  FAMILY = 'family',
  FRIEND = 'friend',
  COMMUNITY = 'community',
  WORK = 'work',
  OTHER = 'other',
}

export enum YearsKnown {
  LESS_THAN_1 = '<1',
  ONE_TO_3 = '1-3',
  MORE_THAN_3 = '3+',
}

export enum TrustLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Vouch Entity
 * Implements Liskov Substitution: all vouch types follow same contract
 */
@Entity('vouches')
@Index(['giverId', 'receiverId', 'status'])
@Index(['receiverId', 'status'])
export class VouchEntity {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column('uuid')
  giverId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'giverId' })
  giver: UserEntity;

  @Column('uuid')
  receiverId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'receiverId' })
  receiver: UserEntity;

  @Column('varchar', { length: 50 })
  relationshipType: RelationshipType;

  @Column('varchar', { length: 10 })
  yearsKnown: YearsKnown;

  @Column('varchar', { length: 50 })
  trustLevel: TrustLevel;

  @Column('boolean', { nullable: true })
  trustWithChild: boolean | null;

  @Column('text', { nullable: true })
  note: string;

  @Column('varchar', { length: 20, default: VouchStatus.PENDING })
  status: VouchStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  revokedAt: Date;

  @Column('uuid', { nullable: true })
  revokedBy: string;

  /**
   * Business logic
   */
  isActive(): boolean {
    return this.status === VouchStatus.ACTIVE;
  }

  revoke(userId: string): void {
    this.status = VouchStatus.REVOKED;
    this.revokedAt = new Date();
    this.revokedBy = userId;
  }
}
