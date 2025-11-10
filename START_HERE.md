# 🚀 START HERE - Camera Surveillance System

## Quick Start (5 Minutes)

### Step 1: Start Database (30 seconds)
```powershell
docker-compose up -d
```

### Step 2: Start Backend (3 terminals)

**Terminal 1 - NestJS Backend**
```powershell
cd backend
npm install
npm run start:dev
```
Wait for: `🚀 Backend server is running on http://localhost:3333`

**Terminal 2 - Python Service**
```powershell
cd python-service
pip install -r requirements.txt
python main.py
```
Wait for: `Starting Python Camera Service on port 5000...`

**Terminal 3 - Next.js Frontend**
```powershell
cd frontend
npm install
npm run dev
```
Wait for: `✓ Ready on http://localhost:3000`

### Step 3: Open Dashboard
Open browser: **http://localhost:3000**

### Step 4: Add Test Camera

Use PowerShell or curl to add the test camera:

```powershell
$body = @{
    name = "Thang may 1"
    rtspUrl = "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0"
    username = "admin"
    password = "Xincamon@!"
    location = "Building A - Floor 1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3333/cameras" -Method Post -Body $body -ContentType "application/json"
```

Or use curl:
```bash
curl -X POST http://localhost:3333/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thang may 1",
    "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
    "username": "admin",
    "password": "Xincamon@!",
    "location": "Building A - Floor 1"
  }'
```

### Step 5: View Camera Stream

1. Refresh the dashboard (http://localhost:3000)
2. Camera should appear in left sidebar
3. Click the camera to start streaming
4. Video will appear in center grid

## ✅ What's Working

- ✅ Database with PostgreSQL
- ✅ Backend API with NestJS
- ✅ Python RTSP camera service
- ✅ Frontend dashboard with real-time streaming
- ✅ Multi-camera support
- ✅ Grid view modes (1x1, 2x2, 3x3, 4x4)
- ✅ Alert system (ready for YOLOv8)

## 📚 Documentation

- **[README.md](README.md)** - Complete project documentation
- **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup guide
- **[API_TESTING.md](API_TESTING.md)** - API testing guide with Postman
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built

## 🔧 Troubleshooting

### Backend won't start
```powershell
cd backend
rm -rf node_modules
npm install
npm run start:dev
```

### Python service errors
```powershell
cd python-service
python -m pip install --upgrade pip
pip install -r requirements.txt
python main.py
```

### Camera won't connect
```powershell
cd python-service
python test_camera.py  # Test camera connection
```

### Frontend won't load
```powershell
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

## 🎯 Next Steps

1. **Test with your camera** - Update camera credentials
2. **Add more cameras** - Use the API endpoint
3. **Integrate YOLOv8** - Detection team's task
4. **Customize UI** - Modify components in `frontend/src/components`

## 🆘 Need Help?

Check the troubleshooting sections in:
- [QUICKSTART.md](QUICKSTART.md) - Detailed troubleshooting
- Backend logs in terminal
- Python service logs in terminal
- Browser console for frontend errors

## 🌐 Access URLs

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3333
- **Python Service**: http://localhost:5000
- **Python API Docs**: http://localhost:5000/docs
- **pgAdmin**: http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin123`

---

**Ready to go!** 🎉 Open http://localhost:3000 and start monitoring!

