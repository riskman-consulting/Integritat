#!/bin/bash

# Integritat - Start script
# This script starts both the server and client applications

set -e

echo "Starting Integritat application..."

# Navigate to the root directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install || true

# Install server dependencies
if [ -d "server" ]; then
  echo "Installing server dependencies..."
  cd server
  npm install || true
  cd ..
fi

# Install client dependencies
if [ -d "client" ]; then
  echo "Installing client dependencies..."
  cd client
  npm install || true
  cd ..
fi

# Build the project
echo "Building project..."
if [ -f "server/package.json" ]; then
  cd server
  npm run build || npm install || true
  cd ..
fi

# Start the server (main entry point)
echo "Starting server..."
if [ -f "server/package.json" ]; then
  cd server
  npm start
else
  echo "No server found. Please check your project structure."
  exit 1
fi
