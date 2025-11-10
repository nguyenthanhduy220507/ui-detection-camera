# API Testing Guide - Postman

Hướng dẫn test tất cả API endpoints của Camera Surveillance System.

## 🔗 Base URL

```
http://localhost:3333
```

---

## 📹 CAMERAS API

### 1. GET - Lấy Danh Sách Tất Cả Cameras

**Endpoint:** `GET /cameras`

**Headers:**
```
Content-Type: application/json
```

**Response Success (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Thang may 1",
    "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
    "username": "admin",
    "password": "Xincamon@!",
    "status": "offline",
    "location": "Building A - Floor 1",
    "isActive": true,
    "createdAt": "2025-11-10T04:30:00.000Z",
    "updatedAt": "2025-11-10T04:30:00.000Z"
  }
]
```

---

### 2. POST - Thêm Camera Mới

**Endpoint:** `POST /cameras`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Thang may 1",
  "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
  "username": "admin",
  "password": "Xincamon@!",
  "location": "Building A - Floor 1",
  "isActive": true
}
```

**Required Fields:**
- `name` (string) - Tên camera
- `rtspUrl` (string) - RTSP URL của camera
- `username` (string) - Username để kết nối
- `password` (string) - Password để kết nối

**Optional Fields:**
- `location` (string) - Vị trí camera
- `isActive` (boolean) - Camera có hoạt động không (default: true)

**Response Success (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Thang may 1",
  "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
  "username": "admin",
  "password": "Xincamon@!",
  "status": "offline",
  "location": "Building A - Floor 1",
  "isActive": true,
  "createdAt": "2025-11-10T04:30:00.000Z",
  "updatedAt": "2025-11-10T04:30:00.000Z"
}
```

**Test Data Samples:**

```json
// Camera 1 - Thang máy
{
  "name": "Thang may 1",
  "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
  "username": "admin",
  "password": "Xincamon@!",
  "location": "Building A - Floor 1"
}

// Camera 2 - Lối vào
{
  "name": "Loi vao chinh",
  "rtspUrl": "rtsp://192.168.1.100:554/stream1",
  "username": "admin",
  "password": "admin123",
  "location": "Main Entrance"
}

// Camera 3 - Bãi đỗ xe
{
  "name": "Bai do xe",
  "rtspUrl": "rtsp://192.168.1.101:554/stream1",
  "username": "admin",
  "password": "admin123",
  "location": "Parking Lot"
}
```

---

### 3. GET - Lấy Thông Tin 1 Camera

**Endpoint:** `GET /cameras/:id`

**Example:** `GET /cameras/550e8400-e29b-41d4-a716-446655440000`

**Response Success (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Thang may 1",
  "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
  "username": "admin",
  "password": "Xincamon@!",
  "status": "offline",
  "location": "Building A - Floor 1",
  "isActive": true,
  "createdAt": "2025-11-10T04:30:00.000Z",
  "updatedAt": "2025-11-10T04:30:00.000Z"
}
```

**Response Error (404):**
```json
{
  "statusCode": 404,
  "message": "Camera with ID xxx not found"
}
```

---

### 4. PATCH - Cập Nhật Camera

**Endpoint:** `PATCH /cameras/:id`

**Example:** `PATCH /cameras/550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Content-Type: application/json
```

**Request Body (tất cả fields đều optional):**
```json
{
  "name": "Thang may 1 - Updated",
  "location": "Building A - Floor 2",
  "status": "online",
  "isActive": false
}
```

**Response Success (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Thang may 1 - Updated",
  "rtspUrl": "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0",
  "username": "admin",
  "password": "Xincamon@!",
  "status": "online",
  "location": "Building A - Floor 2",
  "isActive": false,
  "createdAt": "2025-11-10T04:30:00.000Z",
  "updatedAt": "2025-11-10T04:35:00.000Z"
}
```

---

### 5. PATCH - Cập Nhật Status Camera

**Endpoint:** `PATCH /cameras/:id/status`

**Example:** `PATCH /cameras/550e8400-e29b-41d4-a716-446655440000/status`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "online"
}
```

**Status Values:**
- `online` - Camera đang hoạt động
- `offline` - Camera không kết nối
- `error` - Camera gặp lỗi

**Response Success (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Thang may 1",
  "status": "online",
  ...
}
```

---

### 6. DELETE - Xóa Camera

**Endpoint:** `DELETE /cameras/:id`

**Example:** `DELETE /cameras/550e8400-e29b-41d4-a716-446655440000`

**Response Success (200):**
```
(No content hoặc confirmation message)
```

---

## 🚨 ALERTS API

### 1. GET - Lấy Tất Cả Alerts

**Endpoint:** `GET /alerts`

**Query Parameters (optional):**
- `cameraId` - Lọc theo camera ID

**Examples:**
- Tất cả alerts: `GET /alerts`
- Alerts của 1 camera: `GET /alerts?cameraId=550e8400-e29b-41d4-a716-446655440000`

**Response Success (200):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "cameraId": "550e8400-e29b-41d4-a716-446655440000",
    "alertType": "danger",
    "description": "Dangerous object detected: knife",
    "timestamp": "2025-11-10T04:35:00.000Z",
    "camera": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Thang may 1"
    },
    "detections": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "objectType": "person",
        "confidence": 0.95,
        "bboxCoordinates": {
          "x": 100,
          "y": 150,
          "width": 200,
          "height": 400
        }
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "objectType": "knife",
        "confidence": 0.87,
        "bboxCoordinates": {
          "x": 150,
          "y": 250,
          "width": 50,
          "height": 80
        }
      }
    ]
  }
]
```

---

### 2. GET - Lấy Alerts Gần Đây

**Endpoint:** `GET /alerts/recent`

**Query Parameters:**
- `limit` (optional, default: 10) - Số lượng alerts muốn lấy

**Example:** `GET /alerts/recent?limit=20`

**Response Success (200):** (Giống GET /alerts)

---

### 3. GET - Lấy Chi Tiết 1 Alert

**Endpoint:** `GET /alerts/:id`

**Example:** `GET /alerts/660e8400-e29b-41d4-a716-446655440000`

**Response Success (200):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "cameraId": "550e8400-e29b-41d4-a716-446655440000",
  "alertType": "danger",
  "description": "Dangerous object detected: knife",
  "timestamp": "2025-11-10T04:35:00.000Z",
  "camera": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Thang may 1",
    "location": "Building A - Floor 1"
  },
  "detections": [...]
}
```

---

### 4. POST - Tạo Alert Mới

**Endpoint:** `POST /alerts`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "cameraId": "550e8400-e29b-41d4-a716-446655440000",
  "alertType": "danger",
  "description": "Dangerous object detected: knife",
  "detections": [
    {
      "objectType": "person",
      "confidence": 0.95,
      "bboxCoordinates": {
        "x": 100,
        "y": 150,
        "width": 200,
        "height": 400
      }
    },
    {
      "objectType": "knife",
      "confidence": 0.87,
      "bboxCoordinates": {
        "x": 150,
        "y": 250,
        "width": 50,
        "height": 80
      }
    }
  ]
}
```

**Required Fields:**
- `cameraId` (string) - ID của camera
- `alertType` (string) - Loại alert: `"warning"` hoặc `"danger"`

**Optional Fields:**
- `description` (string) - Mô tả alert
- `detections` (array) - Danh sách các đối tượng phát hiện

**Alert Types:**
- `warning` - Cảnh báo (màu vàng)
- `danger` - Nguy hiểm (màu đỏ)

**Object Types:**
- `person` - Người
- `knife` - Dao
- `gun` - Súng
- `scissors` - Kéo

**Response Success (201):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "cameraId": "550e8400-e29b-41d4-a716-446655440000",
  "alertType": "danger",
  "description": "Dangerous object detected: knife",
  "timestamp": "2025-11-10T04:35:00.000Z"
}
```

**Test Data Samples:**

```json
// Alert 1 - Danger (Dao)
{
  "cameraId": "YOUR_CAMERA_ID",
  "alertType": "danger",
  "description": "Person with knife detected",
  "detections": [
    {
      "objectType": "person",
      "confidence": 0.95,
      "bboxCoordinates": { "x": 100, "y": 150, "width": 200, "height": 400 }
    },
    {
      "objectType": "knife",
      "confidence": 0.87,
      "bboxCoordinates": { "x": 150, "y": 250, "width": 50, "height": 80 }
    }
  ]
}

// Alert 2 - Danger (Súng)
{
  "cameraId": "YOUR_CAMERA_ID",
  "alertType": "danger",
  "description": "Person with gun detected",
  "detections": [
    {
      "objectType": "person",
      "confidence": 0.98,
      "bboxCoordinates": { "x": 200, "y": 100, "width": 180, "height": 380 }
    },
    {
      "objectType": "gun",
      "confidence": 0.92,
      "bboxCoordinates": { "x": 280, "y": 220, "width": 60, "height": 40 }
    }
  ]
}

// Alert 3 - Warning (Người khả nghi)
{
  "cameraId": "YOUR_CAMERA_ID",
  "alertType": "warning",
  "description": "Suspicious person detected",
  "detections": [
    {
      "objectType": "person",
      "confidence": 0.89,
      "bboxCoordinates": { "x": 150, "y": 200, "width": 190, "height": 410 }
    }
  ]
}
```

---

### 5. DELETE - Xóa Alert

**Endpoint:** `DELETE /alerts/:id`

**Example:** `DELETE /alerts/660e8400-e29b-41d4-a716-446655440000`

**Response Success (200):**
```
(No content)
```

---

## 🔐 AUTH API

### 1. POST - Đăng Ký User Mới

**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "role": "admin"
}
```

**Required Fields:**
- `username` (string) - Tên đăng nhập (unique)
- `password` (string) - Mật khẩu

**Optional Fields:**
- `role` (string) - Vai trò: `"admin"`, `"user"`, `"viewer"` (default: `"user"`)

**Response Success (201):**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440000",
  "username": "admin",
  "role": "admin",
  "isActive": true,
  "createdAt": "2025-11-10T04:30:00.000Z"
}
```

**Response Error (409):**
```json
{
  "statusCode": 409,
  "message": "Username already exists"
}
```

**Test Users:**
```json
// Admin user
{
  "username": "admin",
  "password": "admin123",
  "role": "admin"
}

// Normal user
{
  "username": "user1",
  "password": "user123",
  "role": "user"
}

// Viewer
{
  "username": "viewer1",
  "password": "viewer123",
  "role": "viewer"
}
```

---

### 2. POST - Đăng Nhập

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "role": "admin"
  }
}
```

**Response Error (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

## 🧪 POSTMAN COLLECTION WORKFLOW

### Workflow 1: Setup Cameras

```
1. POST /auth/register          → Tạo admin user
2. POST /auth/login             → Lấy access token
3. POST /cameras                → Thêm camera 1
4. POST /cameras                → Thêm camera 2
5. GET /cameras                 → Xem tất cả cameras
6. PATCH /cameras/:id/status    → Cập nhật status = "online"
```

### Workflow 2: Test Alerts

```
1. GET /cameras                 → Lấy camera ID
2. POST /alerts                 → Tạo alert danger với knife
3. POST /alerts                 → Tạo alert danger với gun
4. POST /alerts                 → Tạo alert warning
5. GET /alerts                  → Xem tất cả alerts
6. GET /alerts/recent?limit=5   → Xem 5 alerts gần nhất
7. GET /alerts?cameraId=xxx     → Xem alerts của 1 camera
```

### Workflow 3: CRUD Operations

```
1. POST /cameras                → Tạo camera mới
2. GET /cameras/:id             → Xem chi tiết
3. PATCH /cameras/:id           → Cập nhật thông tin
4. PATCH /cameras/:id/status    → Cập nhật status
5. DELETE /cameras/:id          → Xóa camera
6. GET /cameras                 → Verify đã xóa
```

---

## 📦 IMPORT VÀO POSTMAN

### Cách 1: Tạo Collection Manually

1. Tạo Collection mới: `Camera Surveillance API`
2. Add folder: `Cameras`, `Alerts`, `Auth`
3. Add requests theo từng endpoint ở trên

### Cách 2: Import Environment Variables

Tạo Environment với variables:

```
base_url = http://localhost:3333
camera_id = (sẽ set sau khi tạo camera)
alert_id = (sẽ set sau khi tạo alert)
access_token = (sẽ set sau khi login)
```

Sử dụng trong requests:
```
{{base_url}}/cameras/{{camera_id}}
```

---

## 🎯 TEST SCENARIOS

### Scenario 1: Happy Path - Camera Management

```
✅ POST /cameras → 201 Created
✅ GET /cameras → 200 OK, return array with new camera
✅ GET /cameras/:id → 200 OK, return camera details
✅ PATCH /cameras/:id → 200 OK, camera updated
✅ DELETE /cameras/:id → 200 OK
✅ GET /cameras/:id → 404 Not Found (đã xóa)
```

### Scenario 2: Alert System

```
✅ POST /cameras → Tạo camera (lưu ID)
✅ POST /alerts với danger + knife → 201 Created
✅ POST /alerts với danger + gun → 201 Created
✅ GET /alerts → 200 OK, return 2 alerts
✅ GET /alerts/recent?limit=1 → 200 OK, return 1 alert
✅ GET /alerts?cameraId=xxx → 200 OK, return alerts của camera đó
✅ DELETE /alerts/:id → 200 OK
```

### Scenario 3: Error Handling

```
❌ GET /cameras/invalid-uuid → 404 Not Found
❌ POST /cameras với missing fields → 400 Bad Request
❌ POST /alerts với invalid cameraId → 404 Not Found
❌ POST /auth/login với wrong password → 401 Unauthorized
❌ POST /auth/register với duplicate username → 409 Conflict
```

---

## 🔍 RESPONSE STATUS CODES

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | GET, PATCH, DELETE thành công |
| 201 | Created | POST thành công |
| 400 | Bad Request | Request body không hợp lệ |
| 401 | Unauthorized | Login thất bại |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Username đã tồn tại |
| 500 | Internal Server Error | Lỗi server |

---

## 💡 TIPS

### 1. Save Response IDs
Sau khi tạo camera, save `id` để dùng cho các requests khác:

**Postman Test Script:**
```javascript
// Trong tab "Tests" của POST /cameras request
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("camera_id", jsonData.id);
}
```

### 2. Auto-generate Test Data
Dùng Postman variables để generate data:
```json
{
  "name": "Camera {{$randomInt}}",
  "rtspUrl": "rtsp://192.168.1.{{$randomInt}}/stream",
  "username": "user_{{$randomUUID}}",
  "password": "{{$randomPassword}}"
}
```

### 3. Chain Requests
Tạo request phụ thuộc vào response trước:
```
Request 1: POST /cameras → Save camera_id
Request 2: POST /alerts → Dùng {{camera_id}}
Request 3: GET /alerts?cameraId={{camera_id}}
```

---

## 🚀 QUICK START

### Step 1: Verify Backend
```bash
curl http://localhost:3333/cameras
# Nên return: []
```

### Step 2: Create First Camera
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

### Step 3: Verify Creation
```bash
curl http://localhost:3333/cameras
# Nên return: array with 1 camera
```

---

## 📞 Support

Nếu gặp lỗi:
1. Check backend logs
2. Verify database đang chạy: `docker-compose ps`
3. Check request body format
4. Verify camera ID exists trước khi tạo alert

**Happy Testing!** 🎉

