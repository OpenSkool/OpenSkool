FROM node:18.12.0-alpine AS base
RUN apk add tini --no-cache
WORKDIR /opt

FROM base AS source
RUN apk add git --no-cache
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
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.mjs"]
