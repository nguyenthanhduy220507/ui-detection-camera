# Quick Start Guide - Camera Surveillance System

## Prerequisites

- **Node.js** 18+ 
- **Python** 3.9+
- **Docker** & **Docker Compose**
- **Git**

## Step 1: Start Database

```powershell
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Wait for containers to be ready (check with)
docker-compose ps
```

Access pgAdmin at http://localhost:5050:
- Email: `admin@admin.com`
- Password: `admin123`

## Step 2: Setup Backend (NestJS)

```powershell
cd backend

# Install dependencies
npm install

# Start backend server
npm run start:dev
```

Backend will run on **http://localhost:3333**

The database tables will be created automatically via TypeORM synchronize.

## Step 3: Setup Python Service

```powershell
cd python-service

# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Test camera connection (optional)
python test_camera.py

# Start Python service
python main.py
```

Python service will run on **http://localhost:5000**

## Step 4: Setup Frontend (Next.js)

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

## Step 5: Add Test Camera

### Option A: Via Backend API

```powershell
# POST request to add camera
curl -X POST http://localhost:3333/cameras `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Thang may 1",
    "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
    "username": "admin",
    "password": "Xincamon@!",
    "location": "Building A - Floor 1"
  }'
```

### Option B: Via Frontend UI

1. Open http://localhost:3000
2. The camera will be in the left sidebar (if seeded)
3. Click on the camera to view its stream

## Verification

### Check all services are running:

1. **Database**: 
   - PostgreSQL: localhost:4444
   - pgAdmin: http://localhost:5050

2. **Backend**: 
   - API: http://localhost:3333
   - Check health: `curl http://localhost:3333`

3. **Python Service**: 
   - API: http://localhost:5000
   - Check health: `curl http://localhost:5000`

4. **Frontend**: 
   - Dashboard: http://localhost:3000

## Troubleshooting

### Database Connection Issues

```powershell
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Backend Not Starting

```powershell
# Check if port 3333 is available
netstat -ano | findstr :3333

# Check backend logs for errors
cd backend
npm run start:dev
```

### Python Service Errors

```powershell
# Make sure OpenCV is installed properly
pip install opencv-python --force-reinstall

# Test camera connection separately
python test_camera.py
```

### Frontend Not Loading

```powershell
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

### Camera Not Connecting

1. **Check network connectivity** to camera IP
2. **Verify RTSP URL** format
3. **Test credentials** are correct
4. **Check Python service logs** for connection errors

```powershell
# Ping camera
ping 172.16.40.73

# Test with VLC or ffmpeg
ffplay rtsp://admin:Xincamon@!@172.16.40.73:554/cam/realmonitor?channel=1&subtype=0
```

## Using the Dashboard

### Left Panel - Camera List
- View all cameras
- Search cameras by name
- Click camera to select and view
- See online/offline status

### Center Panel - Video Grid
- View live camera feeds
- Switch grid modes: 1x1, 2x2, 3x3, 4x4
- Adjust video quality: low, medium, high
- Red flashing border indicates danger alert

### Right Panel - Info
- Reserved for future features
- Will show alerts, logs, PTZ controls

## Next Steps

1. **Add more cameras** via API or database
2. **Integrate YOLOv8** detection (handled by another team)
3. **Customize dashboard** layout and colors
4. **Add user authentication** (already implemented in backend)
5. **Configure alerts** and notifications

## Default Credentials

### Database (PostgreSQL)
- Host: localhost:4444
- Username: `admin`
- Password: `admin123`
- Database: `camera_surveillance`

### pgAdmin
- URL: http://localhost:5050
- Email: `admin@admin.com`
- Password: `admin123`

### Admin User (when implemented)
- Username: `admin`
- Password: `admin123`

## Development Commands

### Backend
```powershell
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build
```

### Python Service
```powershell
python main.py       # Start service
python test_camera.py # Test camera connection
```

### Frontend
```powershell
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Run production build
```

## Support

If you encounter any issues:
1. Check this guide's Troubleshooting section
2. Review logs from each service
3. Verify all prerequisites are installed
4. Check network connectivity to camera

## Architecture Flow

```
Camera (RTSP) 
  ↓
Python Service (port 5000)
  ↓ WebSocket frames
NestJS Backend (port 3333)
  ↓ WebSocket relay
Next.js Frontend (port 3000)
  ↓ Display
User Browser
```

