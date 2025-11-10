'use client';

import { useEffect, useState } from 'react';
import { Camera, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { socketService } from '@/lib/socket';
import clsx from 'clsx';

interface VideoPlayerProps {
  cameraId: string | null;
  className?: string;
}

export default function VideoPlayer({ cameraId, className }: VideoPlayerProps) {
  const { frames, activeAlerts, updateFrame } = useStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cameraId) return;

    setIsConnecting(true);
    setError(null);

    // Connect socket if not already connected
    const socket = socketService.connect();

    // Listen for frames
    const handleFrame = (data: any) => {
      if (data.cameraId === cameraId) {
        updateFrame(cameraId, data.frame);
        setIsConnecting(false);
        setError(null);
      }
    };

    socketService.onFrame(handleFrame);

    // Request stream
    socketService.startStream(cameraId);

    // Listen for stream events
    socket?.on('streamStarted', (data: any) => {
      if (data.cameraId === cameraId) {
        setIsConnecting(false);
        console.log('Stream started for camera:', cameraId);
      }
    });

    socket?.on('streamError', (data: any) => {
      if (data.cameraId === cameraId) {
        setIsConnecting(false);
        setError(data.error || 'Failed to start stream');
      }
    });

    // Cleanup
    return () => {
      socketService.stopStream(cameraId);
      socketService.offFrame();
    };
  }, [cameraId]);

  const frame = cameraId ? frames.get(cameraId) : null;
  const hasAlert = cameraId ? activeAlerts.has(cameraId) : false;
  const alert = cameraId ? activeAlerts.get(cameraId) : null;

  if (!cameraId) {
    return (
      <div
        className={clsx(
          'bg-slate-900 rounded-lg flex items-center justify-center',
          className
        )}
      >
        <div className="text-center text-slate-500">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Select a camera to view</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative bg-slate-900 rounded-lg overflow-hidden',
        hasAlert && alert?.alertType === 'danger' && 'border-4 alert-border',
        className
      )}
    >
      {/* Video Frame */}
      {frame ? (
        <img
          src={`data:image/jpeg;base64,${frame}`}
          alt="Camera feed"
          className="w-full h-full object-contain"
        />
      ) : isConnecting ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2" />
            <p>Connecting to camera...</p>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-red-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No signal</p>
          </div>
        </div>
      )}

      {/* Alert Overlay */}
      {hasAlert && alert && (
        <div
          className={clsx(
            'absolute top-2 right-2 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2',
            alert.alertType === 'danger'
              ? 'bg-red-500 text-white'
              : 'bg-yellow-500 text-black'
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          {alert.alertType === 'danger' ? 'DANGER' : 'WARNING'}
        </div>
      )}

      {/* Camera Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="text-white text-sm">
          <div className="font-semibold">Camera {cameraId.slice(0, 8)}</div>
          <div className="text-xs text-slate-300">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

