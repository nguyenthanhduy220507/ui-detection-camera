import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { AlertDetection } from './entities/alert-detection.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
    @InjectRepository(AlertDetection)
    private detectionsRepository: Repository<AlertDetection>,
  ) {}

  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    const { detections, ...alertData } = createAlertDto;
    
    const alert = this.alertsRepository.create(alertData);
    const savedAlert = await this.alertsRepository.save(alert);

    if (detections && detections.length > 0) {
      const detectionEntities = detections.map(detection =>
        this.detectionsRepository.create({
          alertId: savedAlert.id,
          ...detection,
        }),
      );
      await this.detectionsRepository.save(detectionEntities);
    }

    return savedAlert;
  }

  async findAll(cameraId?: string): Promise<Alert[]> {
    const query: any = {
      relations: ['camera', 'detections'],
      order: { timestamp: 'DESC' },
    };

    if (cameraId) {
      query.where = { cameraId };
    }

    return await this.alertsRepository.find(query);
  }

  async findOne(id: string): Promise<Alert> {
    return await this.alertsRepository.findOne({
      where: { id },
      relations: ['camera', 'detections'],
    });
  }

  async findRecent(limit: number = 10): Promise<Alert[]> {
    return await this.alertsRepository.find({
      relations: ['camera', 'detections'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async remove(id: string): Promise<void> {
    await this.alertsRepository.delete(id);
  }
}

