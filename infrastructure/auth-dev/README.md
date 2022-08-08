# Auth dev

## Build

```sh
docker build -t registry.digitalocean.com/os-dev/auth:19.0.1 infrastructure/auth-dev/
```

## Push

You'll need a [personal access token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) and [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/).

```sh
doctl registry login
docker push registry.digitalocean.com/os-dev/auth:19.0.1
```

## Deploy

Update the app source in the [app settings panel](https://cloud.digitalocean.com/apps/5d93b8b3-7fc0-4ce9-91bc-18a12b6d092e/settings/auth?i=812e5b) if you've changed the version.

If not, you can use the doctl to redeploy the image.

```sh
doctl apps list # Copy the the app ID
doctl apps create-deployment [app-id]
```
