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
ARG PNPM_PACKAGE=app
RUN pnpm install --filter openskool --filter $PNPM_PACKAGE... --frozen-lockfile --offline
RUN pnpm turbo run --filter $PNPM_PACKAGE... build

FROM base-builder AS app-builder
RUN npx pkg \
  -o import-meta-env \
  -t node16-alpine \
  app/node_modules/@import-meta-env/cli/bin/import-meta-env.js

FROM nginx:1.23.1-alpine AS production
COPY --from=app-builder /opt/app/.env.example /opt/.env.example
COPY --from=app-builder /opt/app/dist /var/www
COPY --from=app-builder /opt/app/nginx.conf /etc/nginx/nginx.conf
COPY --from=app-builder /opt/app/start.sh /opt/start.sh
COPY --from=app-builder /opt/import-meta-env /opt/import-meta-env
CMD ["sh", "/opt/start.sh"]
EXPOSE 80
