import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';

export enum ActivityStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

/**
 * Activity Entity
 * Represents a connection/session between users
 * Follows Interface Segregation: focused on activity data
 */
@Entity('activities')
@Index(['helperId', 'status', 'scheduledStart'])
@Index(['requesterId', 'status'])
@Index(['status', 'scheduledStart'])
export class ActivityEntity {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column('uuid')
  helperId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'helperId' })
  helper: UserEntity;

  @Column('uuid')
  requesterId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'requesterId' })
  requester: UserEntity;

  @Column('varchar', { length: 255 })
  activityType: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('timestamp')
  scheduledStart: Date;

  @Column('timestamp')
  scheduledEnd: Date;

  @Column('uuid', { nullable: true })
  locationId: string;

  @Column('uuid', { nullable: true })
  guardianApprovalId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'guardianApprovalId' })
  guardianApproval: UserEntity;

  @Column('uuid', { nullable: true })
  parentApprovalId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'parentApprovalId' })
  parentApproval: UserEntity;

  @Column('varchar', { length: 50 })
  status: ActivityStatus = ActivityStatus.PENDING_APPROVAL;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  startLatitude: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  startLongitude: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  endLatitude: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  endLongitude: number;

  @Column('int', { nullable: true })
  durationMinutes: number;

  @Column('timestamp', { nullable: true })
  actualStartTime: Date;

  @Column('timestamp', { nullable: true })
  actualEndTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text', { nullable: true })
  cancelReason: string;

  @Column('boolean', { default: false })
  panicButtonPressed: boolean;

  @Column('timestamp', { nullable: true })
  panicTriggeredAt: Date;

  /**
   * Business logic
   */
  isActive(): boolean {
    return this.status === ActivityStatus.ACTIVE;
  }

  isPending(): boolean {
    return this.status === ActivityStatus.PENDING_APPROVAL;
  }

  canStart(): boolean {
    return this.status === ActivityStatus.APPROVED;
  }

  canEnd(): boolean {
    return this.status === ActivityStatus.ACTIVE;
  }

  getDurationHours(): number {
    if (!this.actualStartTime || !this.actualEndTime) {
      return 0;
    }
    return (this.actualEndTime.getTime() - this.actualStartTime.getTime()) / (1000 * 60 * 60);
  }
}
