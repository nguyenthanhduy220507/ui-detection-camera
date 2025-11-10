import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './entities/camera.entity';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import axios from 'axios';

@Injectable()
export class CamerasService {
  private readonly logger = new Logger(CamerasService.name);
  private readonly pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

  constructor(
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
  ) {}

  async create(createCameraDto: CreateCameraDto): Promise<Camera> {
    const camera = this.camerasRepository.create(createCameraDto);
    const savedCamera = await this.camerasRepository.save(camera);

    // Add camera to Python service
    try {
      await this.addCameraToPythonService(savedCamera);
      this.logger.log(`Camera ${savedCamera.id} added to Python service`);
    } catch (error) {
      this.logger.error(`Failed to add camera to Python service: ${error.message}`);
      // Don't throw error, camera already saved to DB
    }

    return savedCamera;
  }

  private async addCameraToPythonService(camera: Camera): Promise<void> {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/cameras/add`, {
        camera_id: camera.id,  // Pass backend camera ID
        name: camera.name,
        rtsp_url: camera.rtspUrl,
        username: camera.username,
        password: camera.password,
      }, {
        timeout: 5000,
      });
      this.logger.log(`Python service response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      this.logger.error(`Error adding camera to Python service: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Camera[]> {
    return await this.camerasRepository.find({
      relations: ['group'],
      order: { groupId: 'ASC', orderIndex: 'ASC', name: 'ASC' },
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
    
    // Remove from Python service first
    try {
      await axios.delete(`${this.pythonServiceUrl}/cameras/${id}`, {
        timeout: 5000,
      });
      this.logger.log(`Camera ${id} removed from Python service`);
    } catch (error) {
      this.logger.warn(`Failed to remove camera from Python service: ${error.message}`);
    }
    
    await this.camerasRepository.remove(camera);
  }

  async assignToGroup(id: string, groupId: string | null, orderIndex?: number): Promise<Camera> {
    const camera = await this.findOne(id);
    camera.groupId = groupId;
    
    if (orderIndex !== undefined) {
      camera.orderIndex = orderIndex;
    }
    
    this.logger.log(`Camera ${id} assigned to group ${groupId || 'none'}`);
    return await this.camerasRepository.save(camera);
  }

  async batchAssignToGroup(cameraIds: string[], groupId: string | null): Promise<Camera[]> {
    const cameras = await this.camerasRepository.findByIds(cameraIds);
    
    cameras.forEach(camera => {
      camera.groupId = groupId;
    });
    
    const updated = await this.camerasRepository.save(cameras);
    this.logger.log(`Batch assigned ${cameras.length} cameras to group ${groupId || 'none'}`);
    return updated;
  }

  async updateStatus(id: string, status: string): Promise<Camera> {
    const camera = await this.findOne(id);
    const oldStatus = camera.status;
    camera.status = status;
    
    // If disconnecting (going offline), remove from Python service
    if (status === 'offline' && oldStatus !== 'offline') {
      try {
        await axios.delete(`${this.pythonServiceUrl}/cameras/${id}`, {
          timeout: 3000,
        });
        this.logger.log(`Camera ${id} disconnected from Python service`);
      } catch (error) {
        this.logger.warn(`Failed to disconnect camera from Python service: ${error.message}`);
      }
    }
    
    // If connecting (going online), add to Python service
    if (status === 'online' && oldStatus !== 'online') {
      try {
        await this.addCameraToPythonService(camera);
        this.logger.log(`Camera ${id} reconnected to Python service`);
      } catch (error) {
        this.logger.error(`Failed to reconnect camera to Python service: ${error.message}`);
        // Revert status if connection failed
        camera.status = 'error';
      }
    }
    
    return await this.camerasRepository.save(camera);
  }
}

