# change docker env into minikube
eval $(minikube docker-env)

# build image into minikube
docker build -t backend:0.1.0 .

# encode credentials for user, password and database
echo -n "ultrasecret" | base64

# create and apply manifests (do twice to see the changes)
cd /deployment
kubectl apply -f .

# if use minikube, you can see the api service
minikube service api-service --url

# use api
curl http://<ip-minikube>:30001/api/v1/health
curl http://<ip-minikube>:30001/api/v1/users
curl -X POST http://<ip-minikube>:30001/api/v1/users -H "Content-Type: application/json" -d '{"name": "John", "email": "john@example.com"}'
