#!/bin/bash

# Docker Build Script for Task Manager Application
# This script builds and pushes both frontend and backend Docker images

set -e

# Configuration
DOCKER_USERNAME="umesh1212"
VERSION="v1"
PLATFORM="linux/amd64"

echo "🐳 Building Task Manager Docker Images..."

# Function to build and push image
build_and_push() {
    local service=$1
    local directory=$2
    local image_name="${DOCKER_USERNAME}/${service}-todo:${VERSION}"
    
    echo "📦 Building ${service} image..."
    cd "${directory}"
    
    # Build and push the image
    docker buildx build \
        --platform ${PLATFORM} \
        -t ${image_name} \
        --push \
        .
    
    echo "✅ Successfully built and pushed ${image_name}"
    cd - > /dev/null
}

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if buildx is available
if ! docker buildx version > /dev/null 2>&1; then
    echo "❌ Docker buildx is not available. Please update Docker."
    exit 1
fi

echo "✅ Docker and buildx are ready"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "${SCRIPT_DIR}")"

# Build backend
echo "🔧 Building Backend..."
build_and_push "backend" "${PROJECT_ROOT}/backend"

# Build frontend
echo "🌐 Building Frontend..."
build_and_push "frontend" "${PROJECT_ROOT}/frontend"

echo ""
echo "🎉 All images built and pushed successfully!"
echo ""
echo "📋 Built Images:"
echo "  Backend:  ${DOCKER_USERNAME}/backend-todo:${VERSION}"
echo "  Frontend: ${DOCKER_USERNAME}/frontend-todo:${VERSION}"
echo ""
echo "🚀 Next steps:"
echo "  1. Apply Kubernetes manifests: kubectl apply -f k8s/"
echo "  2. Or use the deployment script: ./k8s/deploy.sh"
