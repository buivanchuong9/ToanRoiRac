#!/bin/bash

echo "🚀 Kruskal Visualization - Quick Start"
echo "======================================"

# Kill old processes
echo "🧹 Cleaning up old processes..."
lsof -ti :8000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti :3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Setup backend if needed
if [ ! -d "backend/venv" ]; then
    echo "📦 Setting up Python backend (first time)..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

echo ""
echo "✅ Ready to start!"
echo ""
echo "Choose an option:"
echo "  1) Run both Backend + Frontend (recommended)"
echo "  2) Run Backend only"
echo "  3) Run Frontend only"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo "🚀 Starting both services..."
        npm run dev
        ;;
    2)
        echo "🐍 Starting Python backend..."
        cd backend && ./start.sh
        ;;
    3)
        echo "⚛️  Starting Next.js frontend..."
        npm run dev:frontend
        ;;
    *)
        echo "❌ Invalid choice. Running both by default..."
        npm run dev
        ;;
esac
