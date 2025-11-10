import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamerasService } from './cameras.service';
import { CamerasController } from './cameras.controller';
import { CameraGroupsService } from './camera-groups.service';
import { CameraGroupsController } from './camera-groups.controller';
import { Camera } from './entities/camera.entity';
import { CameraGroup } from './entities/camera-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Camera, CameraGroup])],
  controllers: [CamerasController, CameraGroupsController],
  providers: [CamerasService, CameraGroupsService],
  exports: [CamerasService, CameraGroupsService],
})
export class CamerasModule {}

