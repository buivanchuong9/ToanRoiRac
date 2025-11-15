#!/bin/bash

# Script khởi động hệ thống Kruskal Visualization
# Chạy cả Backend (Python) và Frontend (Next.js)

echo "🚀 Starting Kruskal Visualization System..."

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Kiểm tra pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Using npm instead."
    NPM_CMD="npm"
else
    NPM_CMD="pnpm"
fi

echo ""
echo "📦 Installing dependencies..."

# Install Python dependencies
echo "Installing Python dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

cd ..

# Install Node dependencies
echo "Installing Node.js dependencies..."
$NPM_CMD install > /dev/null 2>&1

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🎬 Starting servers..."
echo ""

# Start Python backend in background
echo "Starting Python Backend (http://localhost:8000)..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Next.js frontend
echo "Starting Next.js Frontend (http://localhost:3000)..."
$NPM_CMD dev &
FRONTEND_PID=$!

echo ""
echo "✨ System is running!"
echo ""
echo "📍 Backend API:  http://localhost:8000"
echo "📍 API Docs:     http://localhost:8000/docs"
echo "📍 Frontend:     http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Trap Ctrl+C to kill both processes
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for any process to exit
wait
