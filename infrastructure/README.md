# Infrastructure

## Setup

### Install services

```sh
kubectl apply -f echo.yaml
kubectl apply -f hello.yaml
```

### Ingress

```sh
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
```

#### Configure DNS

Get the external IP of your LoadBalancer service.

```sh
kubectl get svc -n nginx-ingress
```

Add DNS records.

```dns
A echo.dev2 [EXTERNAL-IP]
A hello.dev2 [EXTERNAL-IP]
```
