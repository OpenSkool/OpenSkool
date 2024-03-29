# OpenSkool

Welcome to the [OpenSkool](https://openskool.be) \(technically referred to as `os`\)
repository.

The code is structured as a [monorepo](https://monorepo.tools) managed by [pnpm](https://pnpm.io)
and [turborepo](https://github.com/vercel/turborepo).

You will find additional documentation per workspace.

## Workspaces

- [api](./api/README.md)
- [app](./app/README.md)

### Turborepo

Our build and test setup is managed by turborepo. It will take care of the topology
of our workspaces when running scripts. Most scripts have a shortcut in the root
`package.json`.

- `pnpm build`: build all workspaces
- `pnpm dev`: start all workspaces in development mode
- `pnpm lint`: lint all workspaces
- `pnpm test`: test all workspaces

### `.env`

Our Api and App follow the [dotenv flow convention](https://github.com/kerimdzhanov/dotenv-flow) as popularised by [Vite](https://vitejs.dev/guide/env-and-mode.html#env-files).

We automatically load in the contents of the dotenv files based on the mode the
code is run in. Where the mode is one of `development`, `production`, or `test`
as set by the NODE_ENV environment variable we will load the following files in
order of presendence.

- Pre-set environment variables
- `.env.[mode].local`
- `.env.[mode]`
- `.env.local`
- `.env`

Some rules of thumb.

- `.env` should contain all project variables with a placeholder value. This file can be used as a reference to what is required.
- `.env[.*].local` is the only one gitignored. Sensitive values should only go in these.
- None of these files are used in deployment environments. The mode is a reference to the `NODE_ENV` value, and not an indication of an actual deployment environment.

## Setup

### Docker

There is a `docker-compose.yaml` in the root of the project containing some services required for development.

Start all containers.

```sh
docker-compose up -d
```

This will start a [Keycloak dev instance](http://localhost:8080) amd 3 databases.

### Keycloak

Open the [Keycloak Admin panel](http://localhost:8080/admin) and log in with your root credentials. (`keycloak` / `keycloak` when using Docker)

Create [a realm](https://www.keycloak.org/docs/latest/server_admin/index.html#configuring-realms) called "os-local" for your local "Skool" to store your local users in.

#### Create user

You'll need to create a user in your Skool Realm in order to use the App.
