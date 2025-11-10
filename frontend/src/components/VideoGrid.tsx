'use client';

import { useStore } from '@/store/useStore';
import VideoPlayer from './VideoPlayer';
import GridControls from './GridControls';
import clsx from 'clsx';

export default function VideoGrid() {
  const { gridMode, gridCameras, selectedGridSlot, setSelectedGridSlot, clearGridSlot } = useStore();

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

  const handleGridCellClick = (index: number) => {
    setSelectedGridSlot(index);
  };

  const handleClearSlot = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    clearGridSlot(index);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Controls */}
      <GridControls />

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className={`grid ${getGridClass()} gap-4 h-full`}>
          {Array.from({ length: getGridCount() }).map((_, index) => {
            const cameraId = gridCameras.get(index) || null;
            const isSelected = selectedGridSlot === index;
            
            return (
              <div
                key={index}
                onClick={() => handleGridCellClick(index)}
                className={clsx(
                  'relative cursor-pointer transition-all rounded-lg overflow-hidden',
                  isSelected && 'ring-4 ring-blue-500 ring-opacity-75'
                )}
              >
                <VideoPlayer
                  cameraId={cameraId}
                  className="min-h-0 h-full"
                />
                
                {/* Slot Number Badge */}
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-semibold">
                  Slot {index + 1}
                </div>
                
                {/* Clear Button (if camera assigned) */}
                {cameraId && (
                  <button
                    onClick={(e) => handleClearSlot(index, e)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors"
                  >
                    Clear
                  </button>
                )}
                
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 px-2 py-1 rounded text-xs text-white font-semibold">
                    Click camera to assign here
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

