# Auth dev

## Build

```sh
docker build -f auth/Dockerfile -t registry.digitalocean.com/openskool/auth:19.0.1 .
```

## Push

You'll need a [personal access token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) and [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/).

```sh
doctl registry login
docker push registry.digitalocean.com/openskool/auth:19.0.1
```
