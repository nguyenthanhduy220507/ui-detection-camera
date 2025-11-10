'use client';

import { useEffect, useState } from 'react';
import { Camera, Video, AlertCircle, Search, Plus, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cameraApi } from '@/lib/api';
import { Camera as CameraType } from '@/types';

export default function CameraList() {
  const { cameras, setCameras, selectedCamera, setSelectedCamera } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [togglingCamera, setTogglingCamera] = useState<string | null>(null);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      const response = await cameraApi.getAll();
      setCameras(response.data);
    } catch (error) {
      console.error('Failed to load cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraConnection = async (camera: CameraType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting camera
    
    try {
      setTogglingCamera(camera.id);
      const newStatus = camera.status === 'online' ? 'offline' : 'online';
      
      // If disconnecting and this camera is selected, deselect it
      if (newStatus === 'offline' && selectedCamera?.id === camera.id) {
        setSelectedCamera(null);
      }
      
      await cameraApi.updateStatus(camera.id, newStatus);
      
      // Update local state
      setCameras(cameras.map(c => 
        c.id === camera.id ? { ...c, status: newStatus } : c
      ));
      
      console.log(`Camera ${camera.name} ${newStatus === 'online' ? 'connected' : 'disconnected'}`);
    } catch (error) {
      console.error('Failed to toggle camera status:', error);
    } finally {
      setTogglingCamera(null);
    }
  };

  const filteredCameras = cameras.filter((camera) =>
    camera.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Cameras
          </h2>
          <button
            onClick={loadCameras}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Add Camera"
          >
            <Plus className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Camera List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-slate-400">Loading cameras...</div>
          </div>
        ) : filteredCameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>No cameras found</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredCameras.map((camera) => (
              <div
                key={camera.id}
                className={`relative rounded-lg transition-colors ${
                  selectedCamera?.id === camera.id
                    ? 'bg-blue-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Camera Icon - Click to Toggle Connection */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCameraConnection(camera as CameraType, e);
                    }}
                    disabled={togglingCamera === camera.id}
                    className={`relative group transition-transform ${
                      togglingCamera === camera.id ? 'opacity-50' : 'hover:scale-110'
                    }`}
                    title={
                      togglingCamera === camera.id
                        ? 'Toggling...'
                        : camera.status === 'online'
                        ? 'Click to disconnect'
                        : 'Click to connect'
                    }
                  >
                    {togglingCamera === camera.id ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <>
                        <Video
                          className={`w-5 h-5 transition-colors ${
                            camera.status === 'online'
                              ? 'text-green-400 group-hover:text-green-300'
                              : 'text-gray-400 group-hover:text-gray-300'
                          }`}
                        />
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
                            camera.status
                          )} border-2 border-slate-800 ${
                            camera.status === 'online' ? 'animate-pulse' : ''
                          }`}
                        />
                      </>
                    )}
                  </button>
                  
                  {/* Camera Info - Click to View */}
                  <button
                    onClick={() => {
                      if (camera.status === 'online') {
                        setSelectedCamera(camera);
                      }
                    }}
                    className="flex-1 min-w-0 text-left"
                    disabled={camera.status !== 'online'}
                  >
                    <div className="font-medium truncate text-white">{camera.name}</div>
                    {camera.location && (
                      <div className="text-xs opacity-75 truncate text-slate-300">
                        {camera.location}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span>Total Cameras:</span>
            <span className="font-semibold text-white">{cameras.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Online:</span>
            <span className="font-semibold text-green-400">
              {cameras.filter((c) => c.status === 'online').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

