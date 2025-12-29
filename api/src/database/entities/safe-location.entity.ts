import { Entity, PrimaryColumn, CreateDateColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';

/**
 * Safe Location Entity
 * Community-verified locations where activities can occur
 */
@Entity('safe_locations')
@Index(['verifiedBy', 'createdAt'])
export class SafeLocationEntity {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column('varchar', { length: 255 })
  locationName: string;

  @Column('text')
  address: string;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @Column('uuid')
  verifiedBy: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'verifiedBy' })
  verifier: UserEntity;

  @CreateDateColumn()
  verificationDate: Date;

  @Column('text', { nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  safetyFeatures: string[];

  @Column('varchar', { length: 100, nullable: true })
  openingHours: string;

  @Column('varchar', { length: 100, nullable: true })
  closingHours: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('int', { default: 0 })
  usageCount: number;

  @Column('decimal', { precision: 3, scale: 2, default: 5 })
  safetyRating: number;

  /**
   * Business logic
   */
  isOpen(now: Date = new Date()): boolean {
    if (!this.isActive) return false;

    const hour = now.getHours();
    const minute = now.getMinutes();

    if (!this.openingHours || !this.closingHours) {
      return true; // Assume always open if not specified
    }

    // Simple time string parsing (HH:MM)
    const [openHour, openMin] = this.openingHours.split(':').map(Number);
    const [closeHour, closeMin] = this.closingHours.split(':').map(Number);

    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    const nowMinutes = hour * 60 + minute;

    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }

  addUsage(): void {
    this.usageCount++;
  }
}
