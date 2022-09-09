# Infrastructure

## Setup cluster

```sh
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.8.0 --set installCRDs=true
kubectl apply -f issuer.yaml
```

## Install services

```sh
kubectl apply -f echo.yaml
kubectl apply -f hello.yaml
```

## Install Ingress

```sh
kubectl apply -f ingress.yaml
kubectl apply -f hello.yaml
```

## Configure DNS

Get the external IP of your LoadBalancer service.

```sh
kubectl get svc -n nginx-ingress
```

Add DNS records.

```dns
A echo.dev2 [EXTERNAL-IP]
A hello.dev2 [EXTERNAL-IP]
```
