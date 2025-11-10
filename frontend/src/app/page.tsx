'use client';

import { useEffect } from 'react';
import CameraListTree from '@/components/CameraListTree';
import VideoGrid from '@/components/VideoGrid';
import RightPanel from '@/components/RightPanel';
import { socketService } from '@/lib/socket';
import { useStore } from '@/store/useStore';

export default function DashboardPage() {
  const { addAlert } = useStore();

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Listen for alerts
    socketService.onAlert((alert) => {
      console.log('Alert received:', alert);
      addAlert(alert);
    });

    // Cleanup
    return () => {
      socketService.offAlert();
      socketService.disconnect();
    };
  }, [addAlert]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Camera Surveillance System
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring and threat detection
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-73px)] flex">
        {/* Left Sidebar - Camera List (20%) */}
        <div className="w-[20%] min-w-[250px] max-w-[350px]">
          <CameraListTree />
        </div>

        {/* Center - Video Grid (60%) */}
        <div className="flex-1">
          <VideoGrid />
        </div>

        {/* Right Sidebar - Info Panel (20%) */}
        <div className="w-[20%] min-w-[250px] max-w-[350px]">
          <RightPanel />
        </div>
      </div>
    </main>
  );
}

