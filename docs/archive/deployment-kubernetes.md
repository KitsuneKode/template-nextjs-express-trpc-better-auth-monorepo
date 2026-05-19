> Historical; use [deployment.md](../deployment.md) for production deploy paths.

# Kubernetes Deployment Guide

For production systems at scale, Kubernetes orchestrates containers across multiple machines.

## When to Use Kubernetes

✅ **Use if:**

- Multiple services (API, worker, caching)
- 50+ concurrent users
- Need auto-scaling
- Need zero-downtime deployments
- Running on-premises or multi-cloud
- Need service mesh (traffic management)

❌ **Don't use if:**

- Single small service (use Railway/Fly instead)
- Just starting out (learn Docker first)
- Team unfamiliar with Kubernetes
- Can use managed serverless (Vercel, Lambda)

---

## Setup: Minikube (Local Development)

```bash
# Install Minikube
brew install minikube

# Start cluster
minikube start --cpus=4 --memory=8192

# Enable ingress addon
minikube addons enable ingress

# Set kubectl context
kubectl config current-context
```

---

## Kubernetes Architecture

```
┌─────────────────────────────────────┐
│       Kubernetes Cluster             │
├─────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐ │
│  │   Node 1     │  │   Node 2     │ │
│  │ ┌──────────┐ │  │ ┌──────────┐ │ │
│  │ │ Pod: api │ │  │ │ Pod: api │ │ │
│  │ └──────────┘ │  │ └──────────┘ │ │
│  │ ┌──────────┐ │  │ ┌──────────┐ │ │
│  │ │Pod: web  │ │  │ │Pod: work │ │ │
│  │ └──────────┘ │  │ └──────────┘ │ │
│  └──────────────┘  └──────────────┘ │
├─────────────────────────────────────┤
│  ┌────────────────────────────────┐ │
│  │    Persistent Volume Store     │ │
│  │   (Database, Redis, uploads)   │ │
│  └────────────────────────────────┘ │
├─────────────────────────────────────┤
│  ┌────────────────────────────────┐ │
│  │        Ingress / Load Balancer │ │
│  │  (Routes HTTPS → Services)     │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Docker Image Prerequisites

Your app must be containerized. See [deployment-platforms.md](./deployment-platforms.md) (Docker section).

```bash
# Build image
docker build -t myapp:1.0.0 .

# Tag for registry
docker tag myapp:1.0.0 registry.example.com/myapp:1.0.0

# Push to registry
docker push registry.example.com/myapp:1.0.0
```

---

## Core Kubernetes Objects

### 1. Namespace (Organizational)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
```

```bash
kubectl create namespace production
kubectl config set-context --current --namespace=production
```

### 2. ConfigMap (Config Storage)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  NODE_ENV: 'production'
  LOG_LEVEL: 'info'
```

```bash
kubectl create configmap app-config --from-env-file=.env.production
```

### 3. Secret (Sensitive Data)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: production
type: Opaque
data:
  DATABASE_URL: <base64-encoded>
  SENTRY_DSN: <base64-encoded>
```

```bash
# Create from file
kubectl create secret generic app-secrets --from-env-file=.env.production.secret

# Verify
kubectl get secrets
kubectl describe secret app-secrets
```

### 4. PersistentVolume & PersistentVolumeClaim (Storage)

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: db-pv
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: '/data/db'

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: db-pvc
  namespace: production
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
```

### 5. Deployment (Application)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/myapp:1.0.0
          imagePullPolicy: Always
          ports:
            - containerPort: 3000
              name: http

          # Environment variables
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: app-secrets

          # Resource limits
          resources:
            requests:
              memory: '512Mi'
              cpu: '250m'
            limits:
              memory: '1Gi'
              cpu: '500m'

          # Health checks
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3

          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

### 6. Service (Internal Load Balancing)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
spec:
  selector:
    app: api
  type: ClusterIP # or LoadBalancer for external access
  ports:
    - port: 80 # External port
      targetPort: 3000 # Pod port
      name: http
```

### 7. Ingress (External Access)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: 'letsencrypt-prod'
    nginx.ingress.kubernetes.io/rate-limit: '100'
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - example.com
        - api.example.com
      secretName: app-tls
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

### 8. HorizontalPodAutoscaler (Auto-Scaling)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

---

## Complete Deployment Manifest

**k8s/api-deployment.yaml**

```yaml
---
# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production

---
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  NODE_ENV: 'production'
  LOG_LEVEL: 'info'

---
# Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: production
type: Opaque
stringData:
  DATABASE_URL: 'postgresql://user:pass@db:5432/myapp'
  SENTRY_DSN: 'https://key@sentry.io/123456'
  REDIS_URL: 'redis://redis:6379'

---
# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/myapp:latest
          ports:
            - containerPort: 3000
          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: app-secrets
          resources:
            requests:
              memory: '512Mi'
              cpu: '250m'
            limits:
              memory: '1Gi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10

---
# API Service
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
spec:
  selector:
    app: api
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3000

---
# Web Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: registry.example.com/myapp-web:latest
          ports:
            - containerPort: 3000

---
# Web Service
apiVersion: v1
kind: Service
metadata:
  name: web-service
  namespace: production
spec:
  selector:
    app: web
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 3000

---
# Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: 'letsencrypt-prod'
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - example.com
        - api.example.com
      secretName: app-tls
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80

---
# HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## Deploy

```bash
# Apply manifest
kubectl apply -f k8s/api-deployment.yaml

# Verify
kubectl get all -n production
kubectl get pods -n production -w  # Watch pods

# View logs
kubectl logs -n production deployment/api

# Port forward for testing
kubectl port-forward -n production svc/api-service 3000:80

# Test
curl http://localhost:3000/health
```

---

## Manage Deployments

### Rolling Update (Zero Downtime)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1 # 1 extra pod during update
      maxUnavailable: 0 # 0 pods down during update
  replicas: 3
```

```bash
# Update image
kubectl set image deployment/api api=registry.example.com/myapp:1.1.0 -n production

# Check status
kubectl rollout status deployment/api -n production

# Rollback if needed
kubectl rollout undo deployment/api -n production
```

### Canary Deployment (% of Traffic)

```yaml
# Deployment v1
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-v1
spec:
  replicas: 3
  ...

---
# Deployment v2 (new version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-v2
spec:
  replicas: 1  # Start with 1 pod (10%)
  ...

---
# Service balances between both
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api  # Both v1 and v2 have this label
```

### Scaling

```bash
# Manual scale
kubectl scale deployment api --replicas=5 -n production

# View HPA status
kubectl get hpa -n production
```

---

## Database in Kubernetes

### Option 1: StatefulSet (In-Cluster)

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: production
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: password
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: db-storage
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: db-storage
      spec:
        accessModes: ['ReadWriteOnce']
        resources:
          requests:
            storage: 100Gi
```

### Option 2: External Database (Recommended)

Keep database outside Kubernetes:

- AWS RDS
- Cloud SQL (GCP)
- Azure Database
- Managed Postgres (DigitalOcean, Linode)

Benefits:

- Automatic backups
- Replication
- No data loss on cluster failure
- Professional management

---

## Monitoring & Logging

### Prometheus (Metrics)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
```

### ELK Stack (Logs)

```bash
# Elasticsearch, Logstash, Kibana
helm install elasticsearch elastic/elasticsearch
helm install kibana elastic/kibana
```

### Datadog / Sentry

```bash
# Add datadog agent as sidecar
- name: datadog-agent
  image: gcr.io/datadoghq/agent:latest
  env:
  - name: DD_API_KEY
    valueFrom:
      secretKeyRef:
        name: datadog-secret
        key: api-key
```

---

## Common Issues

**Pods stuck in Pending:**

```bash
kubectl describe pod <pod-name> -n production
# Usually: not enough resources, image pull failed
```

**CrashLoopBackOff:**

```bash
kubectl logs <pod-name> -n production
# App crashed, check app logs
```

**Service not accessible:**

```bash
kubectl get svc -n production
kubectl get ingress -n production
# Check DNS, firewall, ingress controller
```

---

## Production Checklist

- ✅ Namespace created (production)
- ✅ ConfigMap and Secrets set
- ✅ Resource requests/limits configured
- ✅ Health checks (liveness, readiness)
- ✅ PVC for persistent data
- ✅ Service and Ingress configured
- ✅ HPA configured
- ✅ RBAC policies set (if needed)
- ✅ Network policies set (if needed)
- ✅ Monitoring (Prometheus, Datadog)
- ✅ Logging (ELK, Datadog)
- ✅ Backup strategy for data
- ✅ Disaster recovery tested

---

## Next: Operating in Production

See: `troubleshooting.md`, `scaling-strategies.md`, `monitoring-setup.md`
