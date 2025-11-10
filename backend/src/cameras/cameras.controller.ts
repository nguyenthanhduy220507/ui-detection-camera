import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { AssignGroupDto, BatchAssignDto } from './dto/assign-group.dto';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}

  @Post()
  create(@Body() createCameraDto: CreateCameraDto) {
    return this.camerasService.create(createCameraDto);
  }

  @Get()
  findAll() {
    return this.camerasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.camerasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCameraDto: UpdateCameraDto) {
    return this.camerasService.update(id, updateCameraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.camerasService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.camerasService.updateStatus(id, status);
  }

  // Assign camera to group
  @Patch(':id/group')
  assignToGroup(@Param('id') id: string, @Body() assignGroupDto: AssignGroupDto) {
    return this.camerasService.assignToGroup(id, assignGroupDto.groupId, assignGroupDto.orderIndex);
  }

  // Remove camera from group
  @Delete(':id/group')
  removeFromGroup(@Param('id') id: string) {
    return this.camerasService.assignToGroup(id, null);
  }

  // Batch assign cameras to group
  @Post('batch/assign-group')
  batchAssignToGroup(@Body() batchAssignDto: BatchAssignDto) {
    return this.camerasService.batchAssignToGroup(batchAssignDto.cameraIds, batchAssignDto.groupId);
  }
}
