import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CameraGroup } from './entities/camera-group.entity';

@Injectable()
export class CameraGroupsService {
  constructor(
    @InjectRepository(CameraGroup)
    private groupsRepository: Repository<CameraGroup>,
  ) {}

  async findAll(): Promise<CameraGroup[]> {
    return await this.groupsRepository.find({
      relations: ['parent', 'children', 'cameras'],
      order: { orderIndex: 'ASC', name: 'ASC' },
    });
  }

  async findTree(): Promise<CameraGroup[]> {
    // Get root groups (no parent) with all nested relations
    const rootGroups = await this.groupsRepository.find({
      where: { parentId: null },
      order: { orderIndex: 'ASC', name: 'ASC' },
    });

    // For each root group, load full tree structure
    for (const group of rootGroups) {
      await this.loadFullTree(group);
    }

    return rootGroups;
  }

  private async loadFullTree(group: CameraGroup): Promise<void> {
    // Load cameras for this group
    const groupWithCameras = await this.groupsRepository.findOne({
      where: { id: group.id },
      relations: ['cameras'],
    });
    
    if (groupWithCameras) {
      group.cameras = groupWithCameras.cameras || [];
    }

    // Load children groups
    const children = await this.groupsRepository.find({
      where: { parentId: group.id },
      order: { orderIndex: 'ASC', name: 'ASC' },
    });

    group.children = children;

    // Recursively load children's full tree
    if (children && children.length > 0) {
      for (const child of children) {
        await this.loadFullTree(child);
      }
    }
  }

  async create(name: string, parentId?: string, description?: string): Promise<CameraGroup> {
    const group = this.groupsRepository.create({
      name,
      parentId,
      description,
    });
    return await this.groupsRepository.save(group);
  }

  async findOne(id: string): Promise<CameraGroup> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'cameras'],
    });
    if (!group) {
      throw new NotFoundException(`Camera group with ID ${id} not found`);
    }
    return group;
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    await this.groupsRepository.remove(group);
  }
}

