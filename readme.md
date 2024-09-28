# API with ConfigMap and Secrets

## Prerequisites

- Minikube
- Docker
- Node.js

## Objectives

- Create a ConfigMap and Secrets
- Create a Pod that uses the ConfigMap and Secrets
- Create simple API with Node.js and Express with PostgreSQL

# build image into minikube

```bash
docker build -t backend:0.1.0 .
```

# change docker env into minikube

[Doc minikube docker-env](https://minikube.sigs.k8s.io/docs/commands/docker-env/)

```bash
eval $(minikube docker-env)
```

# encode credentials for user, password and database

```bash
echo -n "ultrasecret" | base64
```

# create and apply manifests (do twice to see the changes)

```
cd /deployment
kubectl apply -f .
```

# if use minikube, you can see the api service

```bash
minikube service api-service --url
```

# use api

```bash
curl http://<ip-minikube>:30001/api/v1/health
curl http://<ip-minikube>:30001/api/v1/users
curl -X POST http://<ip-minikube>:30001/api/v1/users -H "Content-Type: application/json" -d '{"name": "John", "email": "john@example.com"}'
```
