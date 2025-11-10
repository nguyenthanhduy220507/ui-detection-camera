# Quick API Test Script
# Tests Camera Surveillance API endpoints

$baseUrl = "http://localhost:3333"

Write-Host "🧪 Testing Camera Surveillance API" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get All Cameras
Write-Host "Test 1: GET /cameras" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/cameras" -Method Get
    Write-Host "✅ Success: Found $($response.Count) cameras" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Create Camera
Write-Host "Test 2: POST /cameras - Create Thang may 1" -ForegroundColor Yellow
try {
    $body = @{
        name = "Thang may 1"
        rtspUrl = "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0"
        username = "admin"
        password = "Xincamon@!"
        location = "Building A - Floor 1"
    } | ConvertTo-Json

    $camera = Invoke-RestMethod -Uri "$baseUrl/cameras" -Method Post -Body $body -ContentType "application/json"
    $cameraId = $camera.id
    Write-Host "✅ Success: Camera created with ID: $cameraId" -ForegroundColor Green
    Write-Host "   Name: $($camera.name)" -ForegroundColor Gray
    Write-Host "   Location: $($camera.location)" -ForegroundColor Gray
    Write-Host "   Status: $($camera.status)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit
}

# Test 3: Get Camera By ID
Write-Host "Test 3: GET /cameras/$cameraId" -ForegroundColor Yellow
try {
    $camera = Invoke-RestMethod -Uri "$baseUrl/cameras/$cameraId" -Method Get
    Write-Host "✅ Success: Retrieved camera details" -ForegroundColor Green
    Write-Host "   Name: $($camera.name)" -ForegroundColor Gray
    Write-Host "   Status: $($camera.status)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Update Camera Status
Write-Host "Test 4: PATCH /cameras/$cameraId/status - Set to online" -ForegroundColor Yellow
try {
    $statusBody = @{
        status = "online"
    } | ConvertTo-Json

    $camera = Invoke-RestMethod -Uri "$baseUrl/cameras/$cameraId/status" -Method Patch -Body $statusBody -ContentType "application/json"
    Write-Host "✅ Success: Camera status updated to: $($camera.status)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 5: Create Alert - Danger
Write-Host "Test 5: POST /alerts - Create danger alert (knife)" -ForegroundColor Yellow
try {
    $alertBody = @{
        cameraId = $cameraId
        alertType = "danger"
        description = "Person with knife detected"
        detections = @(
            @{
                objectType = "person"
                confidence = 0.95
                bboxCoordinates = @{
                    x = 100
                    y = 150
                    width = 200
                    height = 400
                }
            },
            @{
                objectType = "knife"
                confidence = 0.87
                bboxCoordinates = @{
                    x = 150
                    y = 250
                    width = 50
                    height = 80
                }
            }
        )
    } | ConvertTo-Json -Depth 10

    $alert = Invoke-RestMethod -Uri "$baseUrl/alerts" -Method Post -Body $alertBody -ContentType "application/json"
    $alertId = $alert.id
    Write-Host "✅ Success: Alert created with ID: $alertId" -ForegroundColor Green
    Write-Host "   Type: $($alert.alertType)" -ForegroundColor Gray
    Write-Host "   Description: $($alert.description)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 6: Get All Alerts
Write-Host "Test 6: GET /alerts" -ForegroundColor Yellow
try {
    $alerts = Invoke-RestMethod -Uri "$baseUrl/alerts" -Method Get
    Write-Host "✅ Success: Found $($alerts.Count) alerts" -ForegroundColor Green
    foreach ($alert in $alerts) {
        Write-Host "   - [$($alert.alertType)] $($alert.description)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 7: Get Alerts by Camera
Write-Host "Test 7: GET /alerts?cameraId=$cameraId" -ForegroundColor Yellow
try {
    $cameraAlerts = Invoke-RestMethod -Uri "$baseUrl/alerts?cameraId=$cameraId" -Method Get
    Write-Host "✅ Success: Found $($cameraAlerts.Count) alerts for this camera" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 8: Register User
Write-Host "Test 8: POST /auth/register - Create admin user" -ForegroundColor Yellow
try {
    $userBody = @{
        username = "testadmin"
        password = "test123"
        role = "admin"
    } | ConvertTo-Json

    $user = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $userBody -ContentType "application/json"
    Write-Host "✅ Success: User registered" -ForegroundColor Green
    Write-Host "   Username: $($user.username)" -ForegroundColor Gray
    Write-Host "   Role: $($user.role)" -ForegroundColor Gray
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "⚠️  User already exists (this is OK)" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 9: Login
Write-Host "Test 9: POST /auth/login" -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "testadmin"
        password = "test123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Success: Login successful" -ForegroundColor Green
    Write-Host "   Access Token: $($loginResponse.access_token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 10: Get Recent Alerts
Write-Host "Test 10: GET /alerts/recent?limit=5" -ForegroundColor Yellow
try {
    $recentAlerts = Invoke-RestMethod -Uri "$baseUrl/alerts/recent?limit=5" -Method Get
    Write-Host "✅ Success: Retrieved $($recentAlerts.Count) recent alerts" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Summary
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created Resources:" -ForegroundColor Yellow
Write-Host "  - Camera ID: $cameraId" -ForegroundColor White
if ($alertId) {
    Write-Host "  - Alert ID: $alertId" -ForegroundColor White
}
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Open http://localhost:3000 to view dashboard" -ForegroundColor White
Write-Host "  2. Import 'Camera_Surveillance_API.postman_collection.json' to Postman" -ForegroundColor White
Write-Host "  3. Read 'API_TESTING.md' for detailed API documentation" -ForegroundColor White
Write-Host ""
Write-Host "✅ All tests completed!" -ForegroundColor Green

