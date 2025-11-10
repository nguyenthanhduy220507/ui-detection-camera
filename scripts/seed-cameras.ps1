# Seed Camera Data Script
# Seeds 35 cameras into the system

$apiUrl = "http://localhost:3333/cameras"

Write-Host "🎥 Seeding Camera Data..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Camera data array
$cameras = @(
    # Tầng 7
    @{ name = "Camera 7 - Văn phòng 1 (7.7)"; rtspUrl = "rtsp://172.16.40.177:554/Streaming/Channels/101"; location = "Floor 7 - Office 1" },
    @{ name = "Camera 7 - Văn phòng 2 (7.8)"; rtspUrl = "rtsp://172.16.40.178:554/Streaming/Channels/101"; location = "Floor 7 - Office 2" },
    @{ name = "Camera 7 - Văn phòng 3 - Phòng họp (7.6)"; rtspUrl = "rtsp://172.16.40.176:554/Streaming/Channels/101"; location = "Floor 7 - Meeting Room" },
    @{ name = "Camera 7 - Thoát hiểm (7.4)"; rtspUrl = "rtsp://172.16.40.174:554/Streaming/Channels/101"; location = "Floor 7 - Emergency Exit" },
    @{ name = "Camera 7 - Chờ Thang máy (7.2)"; rtspUrl = "rtsp://172.16.40.172:554/Streaming/Channels/101"; location = "Floor 7 - Elevator Lobby" },
    @{ name = "Camera 7 - Thang bộ (7.3)"; rtspUrl = "rtsp://172.16.40.173:554/Streaming/Channels/101"; location = "Floor 7 - Stairs" },
    @{ name = "Camera 7 - Kho để cây (7.1)"; rtspUrl = "rtsp://172.16.40.171:554/Streaming/Channels/101"; location = "Floor 7 - Storage" },
    
    # Tầng 2
    @{ name = "Camera 2 - Thang máy tầng 2 (2.2)"; rtspUrl = "rtsp://172.16.40.122:554/Streaming/Channels/101"; location = "Floor 2 - Elevator" },
    @{ name = "Camera 2 - Lối thoát hiểm tầng 2 (2.3)"; rtspUrl = "rtsp://172.16.40.123:554/Streaming/Channels/101"; location = "Floor 2 - Emergency Exit 1" },
    @{ name = "Camera 2 - Lối thoát hiểm tầng 2 (2.4)"; rtspUrl = "rtsp://172.16.40.124:554/Streaming/Channels/101"; location = "Floor 2 - Emergency Exit 2" },
    @{ name = "Camera 2 - Kho tầng 2 (2.1)"; rtspUrl = "rtsp://172.16.40.121:554/Streaming/Channels/101"; location = "Floor 2 - Storage" },
    
    # Tầng 3
    @{ name = "Camera 3 - Kho tầng 3 (3.1)"; rtspUrl = "rtsp://172.16.40.131:554/Streaming/Channels/101"; location = "Floor 3 - Storage" },
    @{ name = "Camera 3 - Thang máy tầng 3 (3.2)"; rtspUrl = "rtsp://172.16.40.132:554/Streaming/Channels/101"; location = "Floor 3 - Elevator" },
    @{ name = "Camera 3 - Lối thoát hiểm tầng 3 (3.3)"; rtspUrl = "rtsp://172.16.40.133:554/Streaming/Channels/101"; location = "Floor 3 - Emergency Exit 1" },
    @{ name = "Camera 3 - Lối thoát hiểm tầng 3 (3.4)"; rtspUrl = "rtsp://172.16.40.134:554/Streaming/Channels/101"; location = "Floor 3 - Emergency Exit 2" },
    
    # Tầng 4
    @{ name = "Camera 4 - Kho tầng 4 (4.1)"; rtspUrl = "rtsp://172.16.40.141:554/Streaming/Channels/101"; location = "Floor 4 - Storage" },
    @{ name = "Camera 4 - Thang máy tầng 4 (4.2)"; rtspUrl = "rtsp://172.16.40.142:554/Streaming/Channels/101"; location = "Floor 4 - Elevator" },
    @{ name = "Camera 4 - Lối thoát hiểm tầng 4 (4.3)"; rtspUrl = "rtsp://172.16.40.143:554/Streaming/Channels/101"; location = "Floor 4 - Emergency Exit 1" },
    @{ name = "Camera 4 - Lối thoát hiểm tầng 4 (4.4)"; rtspUrl = "rtsp://172.16.40.144:554/Streaming/Channels/101"; location = "Floor 4 - Emergency Exit 2" },
    
    # Tầng 10
    @{ name = "Camera 10 - Sân thượng 1 (10.1)"; rtspUrl = "rtsp://172.16.40.201:554/Streaming/Channels/101"; location = "Floor 10 - Rooftop 1" },
    @{ name = "Camera 10 - Unconnect (10.2)"; rtspUrl = "rtsp://172.16.40.202:554/Streaming/Channels/101"; location = "Floor 10 - Rooftop 2" },
    @{ name = "Camera 10 - Sân thượng 3 (10.3)"; rtspUrl = "rtsp://172.16.40.203:554/Streaming/Channels/101"; location = "Floor 10 - Rooftop 3" },
    @{ name = "Camera 10 - Sân thượng 4 (10.4)"; rtspUrl = "rtsp://172.16.40.204:554/Streaming/Channels/101"; location = "Floor 10 - Rooftop 4" },
    @{ name = "Camera 10 - Sân thượng 5 (10.5)"; rtspUrl = "rtsp://172.16.40.205:554/Streaming/Channels/101"; location = "Floor 10 - Rooftop 5" },
    @{ name = "Camera 10 - Sân thượng 6 (10.6)"; rtspUrl = "rtsp://172.16.40.206:554/Streaming/Channels/101"; location = "Floor 10 - Rooftop 6" },
    
    # Tầng 8
    @{ name = "Camera 8 - Unconnect (8.1)"; rtspUrl = "rtsp://172.16.40.169:554/Streaming/Channels/101"; location = "Floor 8" },
    @{ name = "Camera 8 - Unconnect (8.2)"; rtspUrl = "rtsp://172.16.40.158:554/Streaming/Channels/101"; location = "Floor 8" },
    
    # Tầng 9
    @{ name = "Camera 9 - Unconnect (9.1)"; rtspUrl = "rtsp://172.16.40.159:554/Streaming/Channels/101"; location = "Floor 9" },
    @{ name = "Camera 9 - Unconnect (9.2)"; rtspUrl = "rtsp://172.16.40.157:554/Streaming/Channels/101"; location = "Floor 9" },
    
    # Tầng 1 & Khác
    @{ name = "Camera IPCamera 27 - Unconnect"; rtspUrl = "rtsp://172.16.40.60:554/Streaming/Channels/101"; location = "Unknown Location" },
    @{ name = "Camera IPCamera 28 - Unconnect"; rtspUrl = "rtsp://172.16.40.167:554/Streaming/Channels/101"; location = "Unknown Location" },
    @{ name = "Camera 1 - Kho để đồ (1.13)"; rtspUrl = "rtsp://172.16.40.185:554/Streaming/Channels/101"; location = "Floor 1 - Storage" },
    
    # Thang máy (Dahua format)
    @{ name = "Thang may 1"; rtspUrl = "rtsp://172.16.40.73:554/cam/realmonitor?channel=1&subtype=0"; location = "Elevator 1" },
    @{ name = "Thang may 2"; rtspUrl = "rtsp://172.16.40.160:554/cam/realmonitor?channel=1&subtype=0"; location = "Elevator 2" },
    
    # Sảnh
    @{ name = "Sảnh trước nhà"; rtspUrl = "rtsp://172.16.40.110:554/Streaming/Channels/101"; location = "Main Lobby" }
)

$username = "admin"
$password = "Xincamon@!"
$successCount = 0
$errorCount = 0

foreach ($camera in $cameras) {
    $body = @{
        name = $camera.name
        rtspUrl = $camera.rtspUrl
        username = $username
        password = $password
        location = $camera.location
        isActive = $true
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "✅ Added: $($camera.name)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "❌ Failed: $($camera.name)" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor DarkRed
        $errorCount++
    }
    
    # Small delay to avoid overwhelming the server
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 Seeding Summary" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Success: $successCount cameras" -ForegroundColor Green
Write-Host "❌ Failed: $errorCount cameras" -ForegroundColor Red
Write-Host "📋 Total: $($cameras.Count) cameras" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Open http://localhost:3000 to view cameras" -ForegroundColor Cyan

