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
order.

- `.env`
- `.env.local`
- `.env.[mode]`
- `.env.[mode].local`

## Docker

There is a `docker-compose.yml` in the root of the project containing a postgres
database. It is not mandatory to use this but it's there for your convenience.
