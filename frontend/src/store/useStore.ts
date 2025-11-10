import { create } from 'zustand';

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
};

export type GridMode = '1x1' | '2x2' | '3x3' | '4x4';

export type VideoQuality = 'low' | 'medium' | 'high';

interface StoreState {
  // Cameras
  cameras: Camera[];
  selectedCamera: Camera | null;
  setCameras: (cameras: Camera[]) => void;
  setSelectedCamera: (camera: Camera | null) => void;
  
  // Grid cameras (for multi-camera view)
  gridCameras: Map<number, string | null>; // Map<slotIndex, cameraId>
  selectedGridSlot: number | null;
  setGridCamera: (slotIndex: number, cameraId: string | null) => void;
  setSelectedGridSlot: (slotIndex: number | null) => void;
  clearGridSlot: (slotIndex: number) => void;
  
  // Alerts
  alerts: Alert[];
  activeAlerts: Map<string, Alert>;
  addAlert: (alert: Alert) => void;
  clearAlert: (cameraId: string) => void;
  
  // View settings
  gridMode: GridMode;
  videoQuality: VideoQuality;
  setGridMode: (mode: GridMode) => void;
  setVideoQuality: (quality: VideoQuality) => void;
  
  // Streaming
  activeStreams: Set<string>;
  addActiveStream: (cameraId: string) => void;
  removeActiveStream: (cameraId: string) => void;
  
  // Video frames
  frames: Map<string, string>;
  updateFrame: (cameraId: string, frame: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Cameras
  cameras: [],
  selectedCamera: null,
  setCameras: (cameras) => set({ cameras }),
  setSelectedCamera: (camera) => set({ selectedCamera: camera }),
  
  // Grid cameras (for multi-camera view)
  gridCameras: new Map(),
  selectedGridSlot: null,
  setGridCamera: (slotIndex, cameraId) => set((state) => {
    const newGridCameras = new Map(state.gridCameras);
    newGridCameras.set(slotIndex, cameraId);
    return { gridCameras: newGridCameras };
  }),
  setSelectedGridSlot: (slotIndex) => set({ selectedGridSlot: slotIndex }),
  clearGridSlot: (slotIndex) => set((state) => {
    const newGridCameras = new Map(state.gridCameras);
    newGridCameras.delete(slotIndex);
    return { gridCameras: newGridCameras };
  }),
  
  // Alerts
  alerts: [],
  activeAlerts: new Map(),
  addAlert: (alert) => set((state) => {
    const newActiveAlerts = new Map(state.activeAlerts);
    newActiveAlerts.set(alert.cameraId, alert);
    return {
      alerts: [alert, ...state.alerts],
      activeAlerts: newActiveAlerts,
    };
  }),
  clearAlert: (cameraId) => set((state) => {
    const newActiveAlerts = new Map(state.activeAlerts);
    newActiveAlerts.delete(cameraId);
    return { activeAlerts: newActiveAlerts };
  }),
  
  // View settings
  gridMode: '2x2',
  videoQuality: 'medium',
  setGridMode: (mode) => set({ gridMode: mode }),
  setVideoQuality: (quality) => set({ videoQuality: quality }),
  
  // Streaming
  activeStreams: new Set(),
  addActiveStream: (cameraId) => set((state) => {
    const newStreams = new Set(state.activeStreams);
    newStreams.add(cameraId);
    return { activeStreams: newStreams };
  }),
  removeActiveStream: (cameraId) => set((state) => {
    const newStreams = new Set(state.activeStreams);
    newStreams.delete(cameraId);
    return { activeStreams: newStreams };
  }),
  
  // Video frames
  frames: new Map(),
  updateFrame: (cameraId, frame) => set((state) => {
    const newFrames = new Map(state.frames);
    newFrames.set(cameraId, frame);
    return { frames: newFrames };
  }),
}));

