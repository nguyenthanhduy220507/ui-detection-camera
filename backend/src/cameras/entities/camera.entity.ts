import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Alert } from '../../alerts/entities/alert.entity';
import { CameraGroup } from './camera-group.entity';

@Entity('cameras')
export class Camera {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  rtspUrl: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 'offline' })
  status: string; // online, offline, error

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  groupId: string;

  @ManyToOne(() => CameraGroup, group => group.cameras, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group: CameraGroup;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Alert, alert => alert.camera)
  alerts: Alert[];
}


