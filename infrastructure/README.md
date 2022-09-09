# Infrastructure

## Setup cluster

- Add the cluster as a trusted source for any database that needs contacting.

```sh
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.8.0 --set installCRDs=true
kubectl apply -f issuer.yaml
```

## Prepare secrets

- Get the database information from [digitalocean](https://cloud.digitalocean.com/databases).
  - Remove the credentials from the URL and prefix it with `jdbc:`.
    - Eg. `jdbc:postgresql://db-postgresql-ams3-os-dev-do-user-1013788-0.b.db.ondigitalocean.com:25060/keycloak?sslmode=require`
- Choose root admin credentials.

```sh
kubectl create secret generic auth \
  --from-literal="db_password=___" \
  --from-literal="db_url=___" \
  --from-literal="db_user=___" \
  --from-literal="keycloak_admin=___" \
  --from-literal="keycloak_admin_password=___"
```

## Install services

```sh
kubectl apply -f auth.yaml
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
A auth.dev2 [EXTERNAL-IP]
A echo.dev2 [EXTERNAL-IP]
A hello.dev2 [EXTERNAL-IP]
```
