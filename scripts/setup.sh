#!/bin/bash

echo "🚀 Setting up Camera Surveillance System..."

# Start Docker containers
echo "📦 Starting PostgreSQL and pgAdmin..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi
cd ..

# Setup Python Service
echo "🐍 Setting up Python Service..."
cd python-service
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup Frontend
echo "⚛️ Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi
cd ..

echo ""
echo "✅ Setup completed!"
echo ""
echo "To start the system:"
echo "1. Backend:        cd backend && npm run start:dev"
echo "2. Python Service: cd python-service && python main.py"
echo "3. Frontend:       cd frontend && npm run dev"
echo ""
echo "Access points:"
echo "- Frontend:  http://localhost:3000"
echo "- Backend:   http://localhost:3333"
echo "- Python:    http://localhost:5000"
echo "- pgAdmin:   http://localhost:5050"

