'use client';

import { useEffect, useState } from 'react';
import { 
  Camera, 
  Video, 
  AlertCircle, 
  Search, 
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cameraApi, cameraGroupApi } from '@/lib/api';
import { Camera as CameraType, CameraGroup } from '@/types';

export default function CameraListTree() {
  const { cameras, setCameras, selectedGridSlot, setGridCamera, gridCameras } = useStore();
  const [groups, setGroups] = useState<CameraGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [camerasRes, groupsRes] = await Promise.all([
        cameraApi.getAll(),
        cameraGroupApi.getTree(),
      ]);
      setCameras(camerasRes.data);
      setGroups(groupsRes.data);
      
      // Auto-expand root folder
      if (groupsRes.data.length > 0) {
        setExpandedFolders(new Set([groupsRes.data[0].id]));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

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

  const getCamerasForGroup = (groupId: string) => {
    return cameras.filter(c => c.groupId === groupId);
  };

  const getTotalCameraCount = (group: CameraGroup): number => {
    // Count cameras directly in this group
    let count = cameras.filter(c => c.groupId === group.id).length;
    
    // Recursively count cameras in all children
    if (group.children && group.children.length > 0) {
      group.children.forEach(child => {
        count += getTotalCameraCount(child);
      });
    }
    
    return count;
  };

  const filterCameras = (cameras: CameraType[]) => {
    if (!searchQuery) return cameras;
    return cameras.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderCamera = (camera: CameraType) => {
    // Check if this camera is currently displayed in any grid slot
    const isInGrid = Array.from(gridCameras.values()).includes(camera.id);
    
    return (
      <div
        key={camera.id}
        className={`mb-1.5 rounded-lg transition-colors ${
          isInGrid
            ? 'bg-blue-600 border-2 border-blue-400'
            : 'bg-slate-700 hover:bg-slate-600'
        }`}
      >
      <div className="flex items-center gap-3 p-2 pl-3">
        {/* Camera Icon - Status Indicator Only (Not Clickable) */}
        <div className="relative flex-shrink-0">
          <Video
            className={`w-5 h-5 ${
              camera.status === 'online'
                ? 'text-green-400'
                : camera.status === 'error'
                ? 'text-red-400'
                : 'text-gray-500'
            }`}
          />
          <div
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
              camera.status
            )} border-2 border-slate-800 ${
              camera.status === 'online' ? 'animate-pulse' : ''
            }`}
          />
        </div>
        
        {/* Camera Info - Click to Assign to Selected Grid Slot */}
        <button
          onClick={() => {
            if (camera.status === 'online' && selectedGridSlot !== null) {
              setGridCamera(selectedGridSlot, camera.id);
              console.log(`Assigned ${camera.name} to grid slot ${selectedGridSlot}`);
            }
          }}
          className="flex-1 min-w-0 text-left hover:text-blue-300 transition-colors"
          disabled={camera.status !== 'online' || selectedGridSlot === null}
          title={
            camera.status !== 'online' 
              ? 'Camera offline - cannot view'
              : selectedGridSlot === null
              ? 'Select a grid slot first'
              : `Assign to slot ${selectedGridSlot + 1}`
          }
        >
          <div className={`font-medium truncate text-sm ${
            camera.status === 'online' ? 'text-white' : 'text-gray-500'
          }`}>
            {camera.name}
          </div>
        </button>
      </div>
    </div>
  );
};

  const renderGroup = (group: CameraGroup, level: number = 0) => {
    const isExpanded = expandedFolders.has(group.id);
    const groupCameras = getCamerasForGroup(group.id);
    const filteredGroupCameras = filterCameras(groupCameras);
    const totalCameraCount = getTotalCameraCount(group);
    const hasChildren = (group.children && group.children.length > 0) || groupCameras.length > 0;
    
    // Don't render if no matches in search
    if (searchQuery && filteredGroupCameras.length === 0 && !group.children?.length) {
      return null;
    }

    return (
      <div key={group.id} className="mb-1">
        {/* Folder Header */}
        <button
          onClick={() => toggleFolder(group.id)}
          className="w-full flex items-center gap-2 p-2.5 hover:bg-slate-700 rounded-lg transition-colors text-white"
          style={{ paddingLeft: `${level * 0.75 + 0.625}rem` }}
        >
          {hasChildren && (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </>
          )}
          {isExpanded ? (
            <FolderOpen className="w-5 h-5 text-blue-400" />
          ) : (
            <Folder className="w-5 h-5 text-slate-400" />
          )}
          <span className="font-semibold text-sm">{group.name}</span>
          <span className="text-xs text-slate-400 ml-auto">
            {totalCameraCount}
          </span>
        </button>

        {/* Folder Contents */}
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {/* Child Folders */}
            {group.children?.map(child => renderGroup(child, level + 1))}
            
            {/* Cameras in this group */}
            {filteredGroupCameras.length > 0 && (
              <div className="mt-2" style={{ paddingLeft: `${(level + 1) * 1.5}rem` }}>
                {filteredGroupCameras.map(camera => renderCamera(camera))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const onlineCount = cameras.filter(c => c.status === 'online').length;

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
            onClick={loadData}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Refresh"
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

      {/* Camera Tree */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-slate-400">Loading cameras...</div>
          </div>
        ) : groups.length === 0 && cameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>No cameras found</p>
          </div>
        ) : (
          <div className="p-2">
            {/* Only render ROOT groups (parentId = null) */}
            {groups.filter(g => !g.parentId).map(group => renderGroup(group))}
            
            {/* Cameras without group */}
            {cameras.filter(c => !c.groupId).length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-slate-500 font-semibold mb-1 px-2">
                  UNGROUPED
                </div>
                {filterCameras(cameras.filter(c => !c.groupId)).map(camera =>
                  renderCamera(camera)
                )}
              </div>
            )}
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
            <span className="font-semibold text-green-400">{onlineCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

