# Python Camera Service

FastAPI service for managing RTSP camera connections and streaming video frames.

## Features

- Connect to RTSP cameras
- Stream video frames via WebSocket
- Test camera connections
- Base64 encoded JPEG frames for web compatibility

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
python main.py
```

The service will start on http://localhost:5000

## API Endpoints

- `GET /` - Service health check
- `POST /cameras/add` - Add a new camera
- `POST /cameras/test` - Test camera connection
- `GET /stream/{camera_id}/frame` - Get single frame
- `WS /ws/stream/{camera_id}` - WebSocket stream
- `DELETE /cameras/{camera_id}` - Remove camera
- `GET /cameras` - List all cameras

## Test Camera

```json
{
  "name": "Thang may 1",
  "rtsp_url": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
  "username": "admin",
  "password": "Xincamon@!"
}
```

