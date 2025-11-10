# PowerShell setup script for Windows

Write-Host "🚀 Setting up Camera Surveillance System..." -ForegroundColor Green

# Start Docker containers
Write-Host "📦 Starting PostgreSQL and pgAdmin..." -ForegroundColor Cyan
docker-compose up -d

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Setup Backend
Write-Host "🔧 Setting up Backend..." -ForegroundColor Cyan
Set-Location backend
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}
Set-Location ..

# Setup Python Service
Write-Host "🐍 Setting up Python Service..." -ForegroundColor Cyan
Set-Location python-service
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
deactivate
Set-Location ..

# Setup Frontend
Write-Host "⚛️ Setting up Frontend..." -ForegroundColor Cyan
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}
Set-Location ..

Write-Host ""
Write-Host "✅ Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the system:"
Write-Host "1. Backend:        cd backend; npm run start:dev"
Write-Host "2. Python Service: cd python-service; python main.py"
Write-Host "3. Frontend:       cd frontend; npm run dev"
Write-Host ""
Write-Host "Access points:"
Write-Host "- Frontend:  http://localhost:3000"
Write-Host "- Backend:   http://localhost:3333"
Write-Host "- Python:    http://localhost:5000"
Write-Host "- pgAdmin:   http://localhost:5050"

