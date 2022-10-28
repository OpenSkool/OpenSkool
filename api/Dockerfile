FROM node:18.12.0-bullseye-slim AS base
RUN apt-get update && apt-get install tini && rm -rf /var/lib/apt/lists/*
WORKDIR /opt

FROM base AS source
RUN apt-get update && apt-get install --yes git
COPY package.json pnpm-lock.yaml .
RUN corepack enable && corepack prepare --activate
RUN pnpm fetch
COPY . .

FROM source AS builder
RUN pnpm install --filter openskool --filter api... --frozen-lockfile --offline
RUN pnpm turbo run --filter api... build
RUN pnpm deploy --filter api --prod pruned
RUN find . -name .prisma | xargs -I dir mv dir pruned/node_modules

FROM base AS production
COPY --from=builder /opt/pruned/dist .
COPY --from=builder /opt/pruned/prisma/schema.prisma prisma/
COPY --from=builder /opt/pruned/prisma/migrations prisma/migrations
COPY --from=builder /opt/pruned/node_modules node_modules
ENV NODE_ENV production
EXPOSE 80
USER node
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "index.mjs"]
