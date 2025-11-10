# Camera Surveillance System

A comprehensive camera surveillance system with real-time streaming, object detection, and alert management.

## 🎯 Overview

This system provides a complete solution for monitoring multiple RTSP cameras with real-time video streaming, person detection, and dangerous object detection capabilities.

## 🏗️ Architecture

```
Camera (RTSP) → Python Service → NestJS Backend → Next.js Frontend
                  (port 5000)      (port 3333)      (port 3000)
```

### Tech Stack

- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, Socket.IO
- **Backend**: NestJS with TypeORM, PostgreSQL, WebSocket Gateway
- **Python Service**: FastAPI with OpenCV for RTSP streaming
- **Database**: PostgreSQL 15 (Port 4444)
- **Admin Panel**: pgAdmin (Port 5050)

## ✨ Features

### Dashboard UI
- **Left Sidebar (20%)**: Camera list with search, status indicators
- **Center Panel (60%)**: Live video grid with multiple view modes
  - Grid modes: 1x1, 2x2, 3x3, 4x4
  - Quality settings: Low, Medium, High
  - Real-time streaming via WebSocket
- **Right Panel (20%)**: Reserved for future features (PTZ controls, settings)

### Detection & Alerts
- Person detection with bounding boxes
- Dangerous object detection (knife, gun, scissors)
- Three alert levels:
  - 🟢 **Green (Normal)**: No threats detected
  - 🟡 **Yellow (Warning)**: Suspicious behavior (optional)
  - 🔴 **Red (Danger)**: Dangerous objects detected
- Flashing red border on danger alerts
- Alert history with image/video storage in database

### Camera Management
- Add, edit, delete cameras
- RTSP connection with credentials
- Real-time status monitoring (online/offline/error)
- Camera grouping by location

## 🚀 Quick Start

See **[QUICKSTART.md](QUICKSTART.md)** for detailed setup instructions.

### TL;DR

```powershell
# 1. Start database
docker-compose up -d

# 2. Start backend (new terminal)
cd backend
npm install
npm run start:dev

# 3. Start Python service (new terminal)
cd python-service
pip install -r requirements.txt
python main.py

# 4. Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

## 📁 Project Structure

```
ui-detection-camera/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API & Socket utilities
│   │   ├── store/           # Zustand state management
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── cameras/         # Camera CRUD module
│   │   ├── alerts/          # Alert management module
│   │   ├── auth/            # Authentication module
│   │   ├── stream/          # WebSocket gateway
│   │   ├── database/        # Database seeding
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── python-service/           # FastAPI camera service
│   ├── main.py              # FastAPI application
│   ├── camera_manager.py    # RTSP stream manager
│   ├── test_camera.py       # Camera connection test
│   └── requirements.txt
│
├── scripts/                  # Setup & utility scripts
│   ├── setup.ps1            # Windows setup script
│   ├── setup.sh             # Linux/Mac setup script
│   └── start-all.ps1        # Start all services (Windows)
│
├── docker-compose.yml        # PostgreSQL & pgAdmin
├── README.md                 # This file
├── QUICKSTART.md            # Detailed setup guide
└── .gitignore
```

## 🔌 API Endpoints

### Backend (NestJS) - Port 3333

#### Cameras
- `GET /cameras` - List all cameras
- `POST /cameras` - Add new camera
- `GET /cameras/:id` - Get camera by ID
- `PATCH /cameras/:id` - Update camera
- `DELETE /cameras/:id` - Delete camera
- `PATCH /cameras/:id/status` - Update camera status

#### Alerts
- `GET /alerts` - List all alerts
- `GET /alerts/recent?limit=10` - Get recent alerts
- `GET /alerts?cameraId=xxx` - Get alerts for specific camera
- `POST /alerts` - Create new alert
- `DELETE /alerts/:id` - Delete alert

#### Auth
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

#### WebSocket
- `ws://localhost:3333` - Main WebSocket connection
- Events: `startStream`, `stopStream`, `frame`, `alert`

### Python Service - Port 5000

- `GET /` - Health check
- `POST /cameras/add` - Add camera to stream manager
- `POST /cameras/test` - Test RTSP connection
- `GET /stream/{camera_id}/frame` - Get single frame
- `WS /ws/stream/{camera_id}` - WebSocket stream
- `DELETE /cameras/{camera_id}` - Remove camera
- `GET /cameras` - List all managed cameras

## 🗄️ Database Schema

### Tables

**cameras**
- id (uuid, PK)
- name (string)
- rtspUrl (string)
- username (string)
- password (string)
- status (string: online/offline/error)
- location (string, nullable)
- isActive (boolean)
- createdAt, updatedAt (timestamp)

**alerts**
- id (uuid, PK)
- cameraId (uuid, FK)
- alertType (string: warning/danger)
- imageData (bytea, nullable)
- videoData (bytea, nullable)
- description (text, nullable)
- timestamp (timestamp)

**alert_detections**
- id (uuid, PK)
- alertId (uuid, FK)
- objectType (string: person/knife/gun/scissors)
- confidence (float)
- bboxCoordinates (json: {x, y, width, height})
- metadata (text, nullable)

**users**
- id (uuid, PK)
- username (string, unique)
- passwordHash (string)
- role (string: admin/user/viewer)
- isActive (boolean)
- createdAt (timestamp)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` in each directory and configure:

**Backend (.env)**
```env
DB_HOST=localhost
DB_PORT=4444
DB_USERNAME=admin
DB_PASSWORD=admin123
DB_DATABASE=camera_surveillance
BACKEND_PORT=3333
JWT_SECRET=your-secret-key
PYTHON_SERVICE_URL=http://localhost:5000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_WS_URL=ws://localhost:3333
```

**Python (.env)**
```env
PYTHON_SERVICE_PORT=5000
LOG_LEVEL=INFO
```

## 📝 Test Camera Configuration

```json
{
  "name": "Thang may 1",
  "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
  "username": "admin",
  "password": "Xincamon@!",
  "location": "Building A - Floor 1"
}
```

## 🛠️ Development

### Backend Development
```powershell
cd backend
npm run start:dev     # Start with hot reload
npm run build         # Build for production
npm run start:prod    # Run production build
```

### Python Service Development
```powershell
cd python-service
python test_camera.py  # Test camera connection
python main.py         # Start service
```

### Frontend Development
```powershell
cd frontend
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Run production build
npm run lint          # Run ESLint
```

## 🎥 Next Steps

1. ✅ **Dashboard UI** - Completed
2. ✅ **Backend API** - Completed
3. ✅ **Camera Streaming** - Completed
4. ⏳ **YOLOv8 Integration** - In progress (separate team)
5. 🔜 **Alert System Enhancement** - Pending detection integration
6. 🔜 **User Authentication UI** - Backend ready
7. 🔜 **PTZ Camera Controls** - Right panel

## 📊 Flow Diagram

### Video Streaming Flow
```
1. User opens dashboard → Frontend loads
2. User selects camera → Frontend sends startStream event
3. Backend receives event → Requests stream from Python service
4. Python service connects to RTSP camera
5. Python service captures frames → Encodes to base64
6. Python service sends frames → Backend WebSocket
7. Backend relays frames → Frontend WebSocket
8. Frontend displays frame in video grid
```

### Detection Flow (Future)
```
1. Python service captures frame
2. Frame sent to YOLOv8 model
3. Model detects persons and objects
4. If dangerous object detected → Create alert
5. Alert sent to Backend with image/video
6. Backend stores alert in database
7. Backend broadcasts alert to Frontend
8. Frontend shows red flashing border
```

## 🤝 Contributing

This is a team project. Current focus areas:
- **Frontend & Backend**: Camera dashboard ✅
- **Python Service**: RTSP streaming ✅
- **Detection Team**: YOLOv8 integration 🔄

## 📄 License

Proprietary - Internal project

## 🆘 Support

For issues and questions:
1. Check [QUICKSTART.md](QUICKSTART.md) troubleshooting section
2. Review service logs
3. Test camera connection with `python test_camera.py`
4. Verify all services are running on correct ports

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md) - Detailed setup instructions
- Backend API Docs: http://localhost:3333/api (Swagger - if configured)
- Python API Docs: http://localhost:5000/docs (FastAPI auto-docs)

---

**Built with** ❤️ **for real-time surveillance monitoring**

