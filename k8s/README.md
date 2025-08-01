# Task Manager Kubernetes Deployment

This directory contains Kubernetes manifests and deployment scripts for the Task Manager application.

## 📁 Files Overview

- `namespace.yaml` - Creates the task-manager namespace
- `configmap.yaml` - Application configuration (database settings, URLs, etc.)
- `secret.yaml` - Sensitive data (passwords, JWT secrets)
- `postgres.yaml` - PostgreSQL database deployment with persistent storage
- `backend.yaml` - Node.js backend API deployment and service
- `frontend.yaml` - React frontend deployment and service
- `ingress.yaml` - Ingress configuration for external access
- `deploy.sh` - Automated deployment script
- `debug.sh` - Troubleshooting and debugging script
- `quick-fix.sh` - Quick fixes for common issues

## 🚀 Quick Start

### Prerequisites
- Kubernetes cluster (local or cloud)
- kubectl configured
- Docker images built and pushed to registry

### 1. Build and Push Images
```bash
# From project root
./build-images.sh
```

### 2. Deploy to Kubernetes
```bash
# Option 1: Use the deployment script
./k8s/deploy.sh

# Option 2: Apply manifests manually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

### 3. Verify Deployment
```bash
kubectl get pods -n task-manager
kubectl get services -n task-manager
```

## 🔧 Troubleshooting

### Check Deployment Status
```bash
./k8s/debug.sh
```

### Quick Fix Common Issues
```bash
./k8s/quick-fix.sh
```

### Manual Debugging Commands

**Check pod status:**
```bash
kubectl get pods -n task-manager
```

**View pod logs:**
```bash
kubectl logs -f deployment/backend -n task-manager
kubectl logs -f deployment/frontend -n task-manager
```

**Describe problematic pods:**
```bash
kubectl describe pod <pod-name> -n task-manager
```

**Restart deployments:**
```bash
kubectl rollout restart deployment/backend -n task-manager
kubectl rollout restart deployment/frontend -n task-manager
```

**Port forward for local testing:**
```bash
# Backend API
kubectl port-forward -n task-manager service/backend-service 8080:80
# Then test: curl http://localhost:8080/api/health

# Frontend
kubectl port-forward -n task-manager service/frontend-service 3000:80
# Then visit: http://localhost:3000
```

## 🔐 Configuration

### ConfigMap (configmap.yaml)
Contains non-sensitive configuration:
- `NODE_ENV`: Environment (production/development)
- `PORT`: Backend port (5000)
- `DB_HOST`: Database host (postgres-service)
- `DB_PORT`: Database port (5432)
- `DB_NAME`: Database name (task_manager)
- `DB_USER`: Database username (postgres)
- `JWT_EXPIRE`: JWT token expiration (7d)
- `CLIENT_URL`: Frontend URL for CORS
- `API_URL`: Backend API URL for frontend

### Secret (secret.yaml)
Contains sensitive data (base64 encoded):
- `JWT_SECRET`: Secret key for JWT tokens
- `DB_PASSWORD`: PostgreSQL password
- `DB_URL`: Complete database connection string

## 📊 Resource Requirements

### Backend
- **CPU**: 25m (request) / 100m (limit)
- **Memory**: 16Mi (request) / 100Mi (limit)
- **Replicas**: 1 (configurable)

### Frontend
- **CPU**: 100m (request) / 250m (limit)
- **Memory**: 128Mi (request) / 256Mi (limit)
- **Replicas**: 2 (configurable)

### PostgreSQL
- **CPU**: 100m (request) / 500m (limit)
- **Memory**: 128Mi (request) / 512Mi (limit)
- **Storage**: 10Gi persistent volume

## 🌐 Networking

### Services
- `postgres-service`: ClusterIP on port 5432
- `backend-service`: ClusterIP on port 80 (maps to container port 5000)
- `frontend-service`: ClusterIP on port 80

### Ingress
- Routes `/api/*` to backend service
- Routes `/*` to frontend service
- Supports both production domain and localhost

## 🔄 Health Checks

### Backend Health Checks
- **Liveness Probe**: `/api/health` (delay: 30s, period: 10s)
- **Readiness Probe**: `/api/health` (delay: 5s, period: 5s)
- **Startup Probe**: `/api/health` (failure threshold: 30, period: 10s)

### Frontend Health Checks
- **Liveness Probe**: `/` (delay: 30s, period: 10s)
- **Readiness Probe**: `/` (delay: 5s, period: 5s)
- **Startup Probe**: `/` (failure threshold: 30, period: 10s)

## 🚨 Common Issues

### 1. ImagePullBackOff
- **Cause**: Docker image not found or inaccessible
- **Fix**: Verify image names and ensure they're pushed to registry
- **Command**: `docker pull umesh1212/backend-todo:v1`

### 2. CrashLoopBackOff
- **Cause**: Application crashes on startup
- **Fix**: Check logs and environment variables
- **Command**: `kubectl logs <pod-name> -n task-manager`

### 3. ConfigMap/Secret Not Found
- **Cause**: Configuration not applied
- **Fix**: Apply configuration files
- **Command**: `kubectl apply -f k8s/configmap.yaml -f k8s/secret.yaml`

### 4. Database Connection Issues
- **Cause**: PostgreSQL not ready or wrong connection string
- **Fix**: Ensure PostgreSQL is running and check DB_URL
- **Command**: `kubectl get pods -n task-manager -l app=postgres`

### 5. Service Not Accessible
- **Cause**: Service endpoints not available
- **Fix**: Check if pods are ready and running
- **Command**: `kubectl get endpoints -n task-manager`

## 📝 Updating the Application

### Update Images
1. Build new images with updated tags
2. Update image tags in deployment files
3. Apply changes: `kubectl apply -f k8s/backend.yaml -f k8s/frontend.yaml`
4. Or restart deployments: `kubectl rollout restart deployment/backend deployment/frontend -n task-manager`

### Update Configuration
1. Edit `configmap.yaml` or `secret.yaml`
2. Apply changes: `kubectl apply -f k8s/configmap.yaml`
3. Restart affected deployments to pick up new config

## 🗑️ Cleanup

### Remove All Resources
```bash
kubectl delete namespace task-manager
```

### Remove Specific Components
```bash
kubectl delete -f k8s/
```

## 📞 Support

If you encounter issues:
1. Run the debug script: `./k8s/debug.sh`
2. Check the troubleshooting section above
3. Review Kubernetes events: `kubectl get events -n task-manager --sort-by='.lastTimestamp'`
