FROM node:16.17.0-alpine AS base
ARG PNPM_PACKAGE=api
RUN apk add bash tini --no-cache
WORKDIR /opt

FROM base AS builder
RUN apk add git --no-cache
COPY package.json pnpm-lock.yaml .
RUN corepack enable && corepack prepare --activate
RUN pnpm fetch
COPY . .
RUN pnpm install --filter openskool --filter $PNPM_PACKAGE... --frozen-lockfile --offline
RUN pnpm turbo run --filter $PNPM_PACKAGE... build
RUN find . -name node_modules -type d -prune -exec rm -rf '{}' +
RUN pnpm install --filter openskool --filter $PNPM_PACKAGE --frozen-lockfile --offline --prod

FROM base AS production
COPY --from=builder /opt/node_modules node_modules
COPY --from=builder /opt/$PNPM_PACKAGE/node_modules $PNPM_PACKAGE/node_modules
COPY --from=builder /opt/$PNPM_PACKAGE/dist $PNPM_PACKAGE
ENV NODE_ENV production
EXPOSE 80
USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "$PNPM_PACKAGE/index.mjs"]
