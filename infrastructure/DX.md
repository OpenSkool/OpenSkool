# Developer Experience

## Turborepo remote

We can set up a turborepo remote for caching build artifacts across developer machines and even our CI/CD pipeline.

### Prepare secret

- Generate any token that can be shared with developers and CI/CD.

```sh
kubectl create secret generic os-dx-turbo \
  --from-literal="TURBO_TOKEN="
```

### Deploy

```sh
kubectl -n os-dx apply -f turbo.yaml
```

## Setup local caching

Get the token from a random developer.

```sh
# .env.turbo.local
TURBO_TEAM="team_openskool"
TURBO_TOKEN=""
```
