#!/bin/bash

# Integritat - Start script for Railway deployment
# Simply starts the Node.js server
# Dependencies are installed during the build phase by Railpack

cd "$(dirname "$0")/server"
node src/index.js
