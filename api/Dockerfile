FROM node:16.17.0-alpine AS base
RUN apk add tini --no-cache
WORKDIR /opt

FROM base AS source
RUN apk add git --no-cache
COPY package.json pnpm-lock.yaml .
RUN corepack enable && corepack prepare --activate
RUN pnpm fetch
COPY . .

FROM source AS base-builder
ARG PNPM_PACKAGE=api
RUN pnpm install --filter openskool --filter $PNPM_PACKAGE... --frozen-lockfile --offline
RUN pnpm turbo run --filter $PNPM_PACKAGE... build

FROM base-builder AS api-builder
RUN pnpm deploy --filter api --prod pruned
RUN find . -name .prisma | xargs -I dir mv dir pruned/node_modules

FROM base AS production
COPY --from=api-builder /opt/pruned/dist .
COPY --from=api-builder /opt/pruned/node_modules node_modules
ENV NODE_ENV production
EXPOSE 80
USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.mjs"]
