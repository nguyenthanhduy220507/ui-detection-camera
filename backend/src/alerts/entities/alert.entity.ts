import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Camera } from '../../cameras/entities/camera.entity';
import { AlertDetection } from './alert-detection.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  cameraId: string;

  @ManyToOne(() => Camera, camera => camera.alerts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cameraId' })
  camera: Camera;

  @Column()
  alertType: string; // 'warning' | 'danger'

  @Column({ type: 'bytea', nullable: true })
  imageData: Buffer;

  @Column({ type: 'bytea', nullable: true })
  videoData: Buffer;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  timestamp: Date;

  @OneToMany(() => AlertDetection, detection => detection.alert)
  detections: AlertDetection[];
}

