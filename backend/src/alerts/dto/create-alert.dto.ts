import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  cameraId: string;

  @IsString()
  @IsNotEmpty()
  alertType: string; // 'warning' | 'danger'

  @IsOptional()
  imageData?: Buffer;

  @IsOptional()
  videoData?: Buffer;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  detections?: Array<{
    objectType: string;
    confidence: number;
    bboxCoordinates: { x: number; y: number; width: number; height: number };
  }>;
}

