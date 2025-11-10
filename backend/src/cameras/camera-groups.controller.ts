import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CameraGroupsService } from './camera-groups.service';

@Controller('camera-groups')
export class CameraGroupsController {
  constructor(private readonly groupsService: CameraGroupsService) {}

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get('tree')
  findTree() {
    return this.groupsService.findTree();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; parentId?: string; description?: string }) {
    return this.groupsService.create(body.name, body.parentId, body.description);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}

