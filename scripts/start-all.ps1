# PowerShell script to start all services

Write-Host "🚀 Starting Camera Surveillance System..." -ForegroundColor Green

# Start Backend in new window
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev"

# Wait a bit
Start-Sleep -Seconds 3

# Start Python Service in new window
Write-Host "Starting Python Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd python-service; python main.py"

# Wait a bit
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "✅ All services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:"
Write-Host "- Frontend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "- Backend:   http://localhost:3333" -ForegroundColor Yellow
Write-Host "- Python:    http://localhost:5000" -ForegroundColor Yellow
Write-Host "- pgAdmin:   http://localhost:5050" -ForegroundColor Yellow

