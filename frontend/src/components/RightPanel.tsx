'use client';

import { Info } from 'lucide-react';

export default function RightPanel() {
  return (
    <div className="h-full bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Info className="w-5 h-5" />
          Information
        </h2>
      </div>

      {/* Content - Placeholder for future features */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center text-slate-500 mt-8">
          <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            This panel is reserved for future features
          </p>
          <p className="text-xs mt-2">
            (PTZ controls, camera settings, etc.)
          </p>
        </div>
      </div>
    </div>
  );
}

