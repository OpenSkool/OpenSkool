# OpenSkool Api

## Setup

### Postgres

You need a PG database to run the Api. You can use the docker file or set one up manually.

If you use a manual PG setup, create a `.env.local` file with the correct credential string.

```ini
# api/.env.local
DATABASE_URL="postgresql://openskool:openskool@localhost:5432/openskool"
```

### Keycloak

#### Create OAuth client

You'll need to configure an OAuth client in Keycloak for your local API to use. Navigate in the [Keycloak Admin](http://localhost:8080/admin/master/console) to Realms > your-realm > Clients – to create a new client.

- Client id: `os-local-api` (Or whatever you want)
- Root URL: `http://localhost:3030` (Or wherever you run your local Api)

Open the client settings and update these settings.

- Access Type: `confidential`

Configure this client in your `env` files.

```ini
# api/.env.local
AUTH_CLIENT_ID="" # Eg. os-local-api
AUTH_CLIENT_SECRET="" # You can find the secret in the credentials tabs.
AUTH_REALM_NAME="" # Eg. os-local
```

#### Initialize schema

We use [prisma migrate](https://www.prisma.io/migrate/) to manage our database schema.

```sh
# Push the database schema to our database
pnpm api prisma db push
# Push the database schema to our test database
pnpm api prisma:test db push
# Reset our database
pnpm api prisma migrate reset
# Reset our test database
pnpm api prisma:test migrate reset
```

#### Start

Run `pnpm api dev` to start the api in development mode and log in with the user you created.

#### First seed

To have a useful app it's recommended to seed the database. It's important to do this after logging in with your user so it can be used as a reference.

```sh
pnpm api prisma db seed
```

### Type-safety

The Api has complete type safety from database access through GraphQL exposure
thanks to the power of [Prisma](https://www.prisma.io/) and [Pothos](https://pothos-graphql.dev).

```mermaid
flowchart
  subgraph Api
    prisch[prisma/schema.prisma]
    primig{ }
    prisch -.-> |prisma migrate| primig

    pmsql[[prisma/migrations/**/*.sql]]
    primig <-.-> pmsql

    schema["src/schema/**/* (Pothos)"]
    schema -.-> |codegen| codgen

    codgen[[src/codegen/graphql.schema]]

    domain[src/services/**]
    schema --> domain
  end

  subgraph node_modules
    prityp[["@prisma/client"]]
  end

  domain --> prityp
  prisch -.-> |prisma generate| prityp

  db[(SQL)]
  prisch -.-> |prisma db| db
  prityp --> db
  primig <-.-> db
```

#### Source files

- `prisma/schema.prisma`: single-source of truth of our database schema.
  - Use `prisma generate` to generate a type-safe Prisma client.
  - Use `prisma db [push|pull]` to sync the Prisma schema with the DB.
  - Use `prisma migrate [dev|deploy|reset]` to apply/record database changes as migrations.
- `src/schema/**/*`: single-source of truth of our GraphQL API.
  - Use `codegen` to generate GraphQL DSL. This is done automatically and continuously when running the Api during development.

#### Generated files

- `node_modules/@prisma/client`: The Prisma client used for type-safe access to the database data.
- `prisma/migrations/**/*.sql`: Migrations managed by `prisma migrate`.
- `src/codegen/graphql.schema`: GraphQL SDL used by our IDE for Intellisense, and by the App for type-safe API access.

#### Command reference

- [prisma generate](https://www.prisma.io/docs/reference/api-reference/command-reference#generate)
- [prisma db](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [prisma migrate](https://www.prisma.io/docs/reference/api-reference/command-reference#prisma-migrate)
