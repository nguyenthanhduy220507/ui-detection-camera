from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
from camera_manager import CameraManager
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Camera Surveillance Python Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize camera manager
camera_manager = CameraManager()


class CameraConfig(BaseModel):
    name: str
    rtsp_url: str
    username: str
    password: str
    camera_id: Optional[str] = None


class ConnectionTestRequest(BaseModel):
    camera_id: str
    rtsp_url: str
    username: str
    password: str


@app.get("/")
def read_root():
    return {
        "service": "Camera Surveillance Python Service",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/cameras/add")
async def add_camera(config: CameraConfig):
    """Add a new camera to the manager"""
    try:
        camera_id = await camera_manager.add_camera(
            config.name,
            config.rtsp_url,
            config.username,
            config.password,
            config.camera_id  # Use ID from backend if provided
        )
        return {
            "status": "success",
            "camera_id": camera_id,
            "message": f"Camera '{config.name}' added successfully"
        }
    except Exception as e:
        logger.error(f"Failed to add camera: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/cameras/test")
async def test_connection(request: ConnectionTestRequest):
    """Test RTSP camera connection"""
    try:
        result = await camera_manager.test_connection(
            request.rtsp_url,
            request.username,
            request.password
        )
        return result
    except Exception as e:
        logger.error(f"Connection test failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stream/{camera_id}/frame")
async def get_frame(camera_id: str):
    """Get a single frame from camera"""
    try:
        frame_data = await camera_manager.get_frame(camera_id)
        if frame_data is None:
            raise HTTPException(status_code=404, detail="Camera not found or not streaming")
        return frame_data
    except Exception as e:
        logger.error(f"Failed to get frame: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws/stream/{camera_id}")
async def websocket_stream(websocket: WebSocket, camera_id: str):
    """WebSocket endpoint for streaming camera frames"""
    await websocket.accept()
    logger.info(f"WebSocket connection established for camera: {camera_id}")
    
    try:
        # Start streaming to this client
        async for frame_data in camera_manager.stream_frames(camera_id):
            await websocket.send_json(frame_data)
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for camera: {camera_id}")
    except Exception as e:
        logger.error(f"WebSocket error for camera {camera_id}: {str(e)}")
    finally:
        await camera_manager.stop_stream(camera_id)


@app.delete("/cameras/{camera_id}")
async def remove_camera(camera_id: str):
    """Remove a camera from the manager"""
    try:
        await camera_manager.remove_camera(camera_id)
        return {"status": "success", "message": f"Camera {camera_id} removed"}
    except Exception as e:
        logger.error(f"Failed to remove camera: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/cameras")
async def list_cameras():
    """List all managed cameras"""
    cameras = camera_manager.list_cameras()
    return {"cameras": cameras}


if __name__ == "__main__":
    logger.info("Starting Python Camera Service on port 5000...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )

