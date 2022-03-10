# OpenSkool

Welcome to the [OpenSkool](https://openskool.be) \(technically referred to as `os`\)
repository.

The code is structured as a [monorepo](https://monorepo.tools) managed by [yarn workspaces](https://yarnpkg.com/features/workspaces)
and [turborepo](https://github.com/vercel/turborepo).

You will find additional documentation per workspace.

## Workspaces

- [api](./api/README.md)
- [app](./app/README.md)

### Turborepo

Our build and test setup is managed by turborepo. It will take care of the topology
of our workspaces when running scripts. Most scripts have a shortcut in the root
`package.json`.

- `yarn build`: build all workspaces
- `yarn dev`: start all workspaces in development mode
- `yarn lint`: lint all workspaces
- `yarn test`: test all workspaces

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

## Docker

There is a `docker-compose.yml` in the root of the project containing a postgres
database. It is not mandatory to use this but it's there for your convenience.

Start all containers.

```sh
docker-compose up -d
```
