import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './entities/camera.entity';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';

@Injectable()
export class CamerasService {
  constructor(
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
  ) {}

  async create(createCameraDto: CreateCameraDto): Promise<Camera> {
    const camera = this.camerasRepository.create(createCameraDto);
    return await this.camerasRepository.save(camera);
  }

  async findAll(): Promise<Camera[]> {
    return await this.camerasRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Camera> {
    const camera = await this.camerasRepository.findOne({ where: { id } });
    if (!camera) {
      throw new NotFoundException(`Camera with ID ${id} not found`);
    }
    return camera;
  }

  async update(id: string, updateCameraDto: UpdateCameraDto): Promise<Camera> {
    const camera = await this.findOne(id);
    Object.assign(camera, updateCameraDto);
    return await this.camerasRepository.save(camera);
  }

  async remove(id: string): Promise<void> {
    const camera = await this.findOne(id);
    await this.camerasRepository.remove(camera);
  }

  async updateStatus(id: string, status: string): Promise<Camera> {
    const camera = await this.findOne(id);
    camera.status = status;
    return await this.camerasRepository.save(camera);
  }
}

