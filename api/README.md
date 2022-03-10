# OpenSkool Api

## Setup

### Postgres

You need a PG database to run the Api. You can use the docker file or set one up manually.

If you use a manual PG setup, create a `.env.local` file with the correct credential string.

```ini
# api/.env.local
DATABASE_URL="postgresql://openskool:openskool@localhost:5432/openskool"
```

#### Initialize schema

We use [prisma migrate](https://www.prisma.io/migrate/) to manage our database schema.

`prisma migrate reset` reset the database, applies all migrations, and seeds in some data.

```sh
yarn workspace @os/api prisma migrate reset
```

#### Start

Run `yarn workspace @os/api dev` to start the api in development mode.

### Type-safety

The Api has complete type safety from database access through GraphQL exposure
thanks to the power of [Prisma](https://www.prisma.io/) and [Nexus](https://nexusjs.org/).

```mermaid
flowchart
  subgraph Api
    prisch[prisma/schema.prisma]
    primig{ }
    prisch -.-> |prisma migrate| primig

    pmsql[[prisma/migrations/**/*.sql]]
    primig <-.-> pmsql

    nexsch["src/schema/**/* (Nexus)"]
    nexgen{ }
    nexsch -.-> |nexus generate| nexgen

    nexgengql[[src/generated/graphql.schema]]
    nexgentyp[[src/generated/nexus.ts]]
    nexgen -.-> nexgengql
    nexgen -.-> nexgentyp
    nexsch --> nexgentyp

    domain[src/services/**]
    nexsch --> domain
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
  - Use `nexus:generate` to generate a type-safe GraphQL server. This is done automatically and continuously when running the Api during development.

#### Generated files

- `node_modules/@prisma/client`: The Prisma client used for type-safe access to the database data.
- `prisma/migrations/**/*.sql`: Migrations managed by `prisma migrate`.
- `src/generated/nexus.ts`: Types generated and subsequently used by Nexus to provide a type-safe GraphQL API.
- `src/generated/graphql.schema`: GraphQL schema used by our IDE for Intellisense, and by the App for type-safe API access.

#### Command reference

- [prisma generate](https://www.prisma.io/docs/reference/api-reference/command-reference#generate)
- [prisma db](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [prisma migrate](https://www.prisma.io/docs/reference/api-reference/command-reference#prisma-migrate)
