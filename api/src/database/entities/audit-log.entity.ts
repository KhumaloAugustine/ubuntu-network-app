import { Entity, PrimaryColumn, CreateDateColumn, Column, Index } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

/**
 * Audit Log Entity
 * Immutable log of all important system actions
 * Implements write-once pattern for security
 */
@Entity('audit_logs')
@Index(['userId', 'action', 'createdAt'])
@Index(['action', 'createdAt'])
export class AuditLogEntity {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('varchar', { length: 100 })
  action: string;

  @Column('varchar', { length: 255, nullable: true })
  resource: string;

  @Column('uuid', { nullable: true })
  resourceId: string;

  @Column('text', { nullable: true })
  details: string;

  @Column('varchar', { length: 45, nullable: true })
  ipAddress: string;

  @Column('varchar', { length: 255, nullable: true })
  userAgent: string;

  @Column('varchar', { length: 50, default: 'info' })
  level: 'info' | 'warning' | 'error' | 'critical';

  @CreateDateColumn()
  createdAt: Date;

  @Column('boolean', { default: false })
  flagged: boolean;

  @Column('text', { nullable: true })
  flagReason: string;

  /**
   * Mark log entry as flagged for investigation
   */
  setFlagged(reason: string): void {
    this.flagged = true;
    this.flagReason = reason;
  }
}
