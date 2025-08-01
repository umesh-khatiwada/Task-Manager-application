#!/bin/bash

# Test connectivity within cluster
echo "🔍 Testing Internal Connectivity"
echo "================================"

NAMESPACE="task-manager"

# Get pod names
FRONTEND_POD=$(kubectl get pods -n $NAMESPACE -l app=frontend -o jsonpath='{.items[0].metadata.name}')
BACKEND_POD=$(kubectl get pods -n $NAMESPACE -l app=backend -o jsonpath='{.items[0].metadata.name}')

echo "Frontend Pod: $FRONTEND_POD"
echo "Backend Pod: $BACKEND_POD"
echo ""

# Test frontend directly
echo "1. Testing Frontend Pod directly on port 80:"
kubectl exec $FRONTEND_POD -n $NAMESPACE -- curl -s http://localhost:80/health || echo "Failed"

echo ""
echo "2. Testing Frontend nginx status:"
kubectl exec $FRONTEND_POD -n $NAMESPACE -- nginx -t || echo "Nginx config test failed"

echo ""
echo "3. Testing Backend Pod directly on port 8000:"
kubectl exec $BACKEND_POD -n $NAMESPACE -- curl -s http://localhost:8000/api/health || echo "Failed"

echo ""
echo "4. Testing Backend from Frontend pod (service resolution):"
kubectl exec $FRONTEND_POD -n $NAMESPACE -- curl -s http://backend-service/api/health || echo "Failed"

echo ""
echo "5. Testing Frontend from Backend pod (service resolution):"
kubectl exec $BACKEND_POD -n $NAMESPACE -- curl -s http://frontend-service/health || echo "Failed"

echo ""
echo "6. Checking if processes are listening:"
echo "Frontend nginx processes:"
kubectl exec $FRONTEND_POD -n $NAMESPACE -- ps aux | grep nginx || echo "No nginx processes"

echo ""
echo "Backend node processes:"
kubectl exec $BACKEND_POD -n $NAMESPACE -- ps aux | grep node || echo "No node processes"

echo ""
echo "7. Checking listening ports:"
echo "Frontend ports:"
kubectl exec $FRONTEND_POD -n $NAMESPACE -- netstat -tlnp 2>/dev/null | grep :80 || echo "Port 80 not listening"

echo ""
echo "Backend ports:"
kubectl exec $BACKEND_POD -n $NAMESPACE -- netstat -tlnp 2>/dev/null | grep :8000 || echo "Port 8000 not listening"
