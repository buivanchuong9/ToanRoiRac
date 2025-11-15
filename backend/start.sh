#!/bin/bash

# Backend startup script
cd "$(dirname "$0")"

# Create venv if not exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies if needed
if ! pip show fastapi > /dev/null 2>&1; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Start server
echo "🚀 Starting Python Backend..."
python main.py
