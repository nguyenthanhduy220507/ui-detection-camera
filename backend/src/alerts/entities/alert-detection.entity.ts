import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Alert } from './alert.entity';

@Entity('alert_detections')
export class AlertDetection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  alertId: string;

  @ManyToOne(() => Alert, alert => alert.detections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'alertId' })
  alert: Alert;

  @Column()
  objectType: string; // 'person', 'knife', 'gun', 'scissors', etc.

  @Column('float')
  confidence: number;

  @Column('simple-json')
  bboxCoordinates: { x: number; y: number; width: number; height: number };

  @Column({ type: 'text', nullable: true })
  metadata: string;
}

