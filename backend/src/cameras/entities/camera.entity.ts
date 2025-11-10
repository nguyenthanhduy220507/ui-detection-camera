import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Alert } from '../../alerts/entities/alert.entity';

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

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Alert, alert => alert.camera)
  alerts: Alert[];
}

