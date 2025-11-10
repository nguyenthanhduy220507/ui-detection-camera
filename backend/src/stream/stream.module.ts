import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamGateway } from './stream.gateway';
import { Camera } from '../cameras/entities/camera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Camera])],
  providers: [StreamGateway],
  exports: [StreamGateway],
})
export class StreamModule {}

