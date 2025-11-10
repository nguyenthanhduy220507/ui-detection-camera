'use client';

import { useStore } from '@/store/useStore';
import VideoPlayer from './VideoPlayer';
import GridControls from './GridControls';

export default function VideoGrid() {
  const { gridMode, selectedCamera } = useStore();

  const getGridClass = () => {
    switch (gridMode) {
      case '1x1':
        return 'grid-cols-1 grid-rows-1';
      case '2x2':
        return 'grid-cols-2 grid-rows-2';
      case '3x3':
        return 'grid-cols-3 grid-rows-3';
      case '4x4':
        return 'grid-cols-4 grid-rows-4';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };

  const getGridCount = () => {
    switch (gridMode) {
      case '1x1':
        return 1;
      case '2x2':
        return 4;
      case '3x3':
        return 9;
      case '4x4':
        return 16;
      default:
        return 4;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Controls */}
      <GridControls />

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className={`grid ${getGridClass()} gap-4 h-full`}>
          {Array.from({ length: getGridCount() }).map((_, index) => (
            <VideoPlayer
              key={index}
              cameraId={index === 0 ? selectedCamera?.id || null : null}
              className="min-h-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

