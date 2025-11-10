'use client';

import { Grid3x3, Maximize2, Settings } from 'lucide-react';
import { useStore, GridMode, VideoQuality } from '@/store/useStore';
import clsx from 'clsx';

export default function GridControls() {
  const { gridMode, videoQuality, setGridMode, setVideoQuality } = useStore();

  const gridModes: GridMode[] = ['1x1', '2x2', '3x3', '4x4'];
  const qualities: VideoQuality[] = ['low', 'medium', 'high'];

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Grid Mode Selector */}
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-400 mr-2">Grid:</span>
          <div className="flex gap-1">
            {gridModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setGridMode(mode)}
                className={clsx(
                  'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                  gridMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Title */}
        <div className="flex items-center gap-2">
          <Maximize2 className="w-5 h-5 text-slate-400" />
          <h1 className="text-lg font-semibold text-white">Live View</h1>
        </div>

        {/* Right: Quality Selector */}
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-400 mr-2">Quality:</span>
          <div className="flex gap-1">
            {qualities.map((quality) => (
              <button
                key={quality}
                onClick={() => setVideoQuality(quality)}
                className={clsx(
                  'px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors',
                  videoQuality === quality
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                )}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

