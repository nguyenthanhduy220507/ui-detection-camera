import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AssignGroupDto {
  @IsString()
  @IsOptional()
  groupId: string | null;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;
}

export class BatchAssignDto {
  @IsString({ each: true })
  cameraIds: string[];

  @IsString()
  @IsOptional()
  groupId: string | null;
}

