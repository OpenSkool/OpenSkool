# Api Seed

## Auth roles

The seed will query the Auth service to (ao.) know for which users to seed data.

Make sure the configured Auth Client (`AUTH_CLIENT_ID` / `AUTH_CLIENT_SECRET`) has these service accounts roles.

- `query-users`
- `view-users`
- `view-realm`

## Remote seed

If you want to seed a remote database (Eg. on DEV) you'll need to set some env variables.

- AUTH_BASE_URL: Eg. `https://auth.dev.openskool.dev`
- AUTH_REALM_NAME: Eg. `os-dev`
- DATABASE_URL: Get from DigitalOcean.
- AUTH_CLIENT_ID: Eg. `os-dev-api`
- AUTH_CLIENT_SECRET: Eg. Get from Keycloak Admin.

```sh
AUTH_BASE_URL="" \
AUTH_REALM_NAME="" \
DATABASE_URL="" \
AUTH_CLIENT_ID="" \
AUTH_CLIENT_SECRET="" \
pnpm api exec prisma db seed
```
