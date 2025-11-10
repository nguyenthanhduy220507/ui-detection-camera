import cv2
import base64
import asyncio
import logging
from datetime import datetime
from typing import Dict, Optional, AsyncGenerator
import numpy as np
import uuid

logger = logging.getLogger(__name__)


class CameraStream:
    """Manages a single RTSP camera stream"""
    
    def __init__(self, camera_id: str, name: str, rtsp_url: str, username: str, password: str):
        self.camera_id = camera_id
        self.name = name
        self.rtsp_url = rtsp_url
        self.username = username
        self.password = password
        self.capture: Optional[cv2.VideoCapture] = None
        self.is_streaming = False
        self.last_frame = None
        self.last_frame_time = None
        
    def build_rtsp_url(self) -> str:
        """Build RTSP URL with credentials"""
        # Handle URLs that already have credentials
        if '@' in self.rtsp_url:
            return self.rtsp_url
        
        # Insert credentials into URL
        if self.rtsp_url.startswith('rtsp://'):
            return f"rtsp://{self.username}:{self.password}@{self.rtsp_url[7:]}"
        return self.rtsp_url
    
    async def connect(self) -> bool:
        """Connect to the RTSP stream"""
        try:
            rtsp_url = self.build_rtsp_url()
            logger.info(f"Connecting to camera {self.name} at {rtsp_url[:20]}...")
            
            self.capture = cv2.VideoCapture(rtsp_url)
            self.capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Reduce latency
            
            # Try to read a frame to verify connection
            ret, frame = self.capture.read()
            if ret:
                self.is_streaming = True
                self.last_frame = frame
                self.last_frame_time = datetime.now()
                logger.info(f"Successfully connected to camera {self.name}")
                return True
            else:
                logger.error(f"Failed to read frame from camera {self.name}")
                self.disconnect()
                return False
        except Exception as e:
            logger.error(f"Error connecting to camera {self.name}: {str(e)}")
            self.disconnect()
            return False
    
    def disconnect(self):
        """Disconnect from the RTSP stream"""
        self.is_streaming = False
        if self.capture:
            self.capture.release()
            self.capture = None
        logger.info(f"Disconnected from camera {self.name}")
    
    def get_frame(self) -> Optional[Dict]:
        """Get current frame from stream"""
        if not self.is_streaming or not self.capture:
            return None
        
        try:
            ret, frame = self.capture.read()
            if not ret:
                logger.warning(f"Failed to read frame from {self.name}")
                return None
            
            self.last_frame = frame
            self.last_frame_time = datetime.now()
            
            # Resize frame for faster transmission (optional)
            frame_resized = cv2.resize(frame, (640, 480))
            
            # Encode frame to JPEG
            _, buffer = cv2.imencode('.jpg', frame_resized, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            
            return {
                "camera_id": self.camera_id,
                "frame": frame_base64,
                "timestamp": self.last_frame_time.isoformat(),
                "width": frame_resized.shape[1],
                "height": frame_resized.shape[0]
            }
        except Exception as e:
            logger.error(f"Error getting frame from {self.name}: {str(e)}")
            return None


class CameraManager:
    """Manages multiple camera streams"""
    
    def __init__(self):
        self.cameras: Dict[str, CameraStream] = {}
        
    async def add_camera(self, name: str, rtsp_url: str, username: str, password: str) -> str:
        """Add a new camera and connect to it"""
        camera_id = str(uuid.uuid4())
        camera = CameraStream(camera_id, name, rtsp_url, username, password)
        
        success = await camera.connect()
        if not success:
            raise Exception(f"Failed to connect to camera {name}")
        
        self.cameras[camera_id] = camera
        logger.info(f"Camera {name} added with ID: {camera_id}")
        return camera_id
    
    async def test_connection(self, rtsp_url: str, username: str, password: str) -> Dict:
        """Test RTSP connection without adding to manager"""
        try:
            test_camera = CameraStream("test", "Test Camera", rtsp_url, username, password)
            success = await test_camera.connect()
            
            if success:
                # Get one frame to verify
                frame_data = test_camera.get_frame()
                test_camera.disconnect()
                
                return {
                    "status": "success",
                    "message": "Connection successful",
                    "frame_captured": frame_data is not None
                }
            else:
                return {
                    "status": "failed",
                    "message": "Could not connect to camera"
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    async def get_frame(self, camera_id: str) -> Optional[Dict]:
        """Get a single frame from camera"""
        camera = self.cameras.get(camera_id)
        if not camera:
            return None
        
        return camera.get_frame()
    
    async def stream_frames(self, camera_id: str) -> AsyncGenerator[Dict, None]:
        """Stream frames from camera"""
        camera = self.cameras.get(camera_id)
        if not camera:
            raise Exception(f"Camera {camera_id} not found")
        
        if not camera.is_streaming:
            await camera.connect()
        
        while camera.is_streaming:
            frame_data = camera.get_frame()
            if frame_data:
                yield frame_data
            await asyncio.sleep(0.033)  # ~30 FPS
    
    async def stop_stream(self, camera_id: str):
        """Stop streaming from a camera"""
        camera = self.cameras.get(camera_id)
        if camera:
            camera.disconnect()
    
    async def remove_camera(self, camera_id: str):
        """Remove a camera from manager"""
        camera = self.cameras.get(camera_id)
        if camera:
            camera.disconnect()
            del self.cameras[camera_id]
            logger.info(f"Camera {camera_id} removed")
    
    def list_cameras(self) -> list:
        """List all cameras"""
        return [
            {
                "camera_id": cam.camera_id,
                "name": cam.name,
                "is_streaming": cam.is_streaming,
                "last_frame_time": cam.last_frame_time.isoformat() if cam.last_frame_time else None
            }
            for cam in self.cameras.values()
        ]

