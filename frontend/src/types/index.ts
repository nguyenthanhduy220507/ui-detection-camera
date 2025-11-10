export type Camera = {
  id: string;
  name: string;
  rtspUrl: string;
  username: string;
  password: string;
  status: 'online' | 'offline' | 'error';
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Alert = {
  id: string;
  cameraId: string;
  alertType: 'warning' | 'danger';
  imageData?: string;
  videoData?: string;
  description?: string;
  timestamp: string;
  detections?: Detection[];
};

export type Detection = {
  id: string;
  objectType: string;
  confidence: number;
  bboxCoordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type GridMode = '1x1' | '2x2' | '3x3' | '4x4';

export type VideoQuality = 'low' | 'medium' | 'high';

export type CameraStatus = 'online' | 'offline' | 'error';

