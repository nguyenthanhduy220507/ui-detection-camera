'use client';

import { useEffect, useState } from 'react';
import { Camera, Video, AlertCircle, Search, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cameraApi } from '@/lib/api';
import { Camera as CameraType } from '@/types';

export default function CameraList() {
  const { cameras, setCameras, selectedCamera, setSelectedCamera } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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
              <button
                key={camera.id}
                onClick={() => setSelectedCamera(camera)}
                className={`w-full p-3 rounded-lg transition-colors text-left ${
                  selectedCamera?.id === camera.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Video className="w-5 h-5" />
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
                        camera.status
                      )} border-2 border-slate-800`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{camera.name}</div>
                    {camera.location && (
                      <div className="text-xs opacity-75 truncate">
                        {camera.location}
                      </div>
                    )}
                  </div>
                </div>
              </button>
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

