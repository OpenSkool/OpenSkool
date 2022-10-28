FROM node:18.12.0-bullseye-slim AS base
WORKDIR /opt

FROM base AS source
RUN apt-get update && apt-get install --yes git
COPY package.json pnpm-lock.yaml .
RUN corepack enable && corepack prepare --activate
RUN pnpm fetch
COPY . .

FROM source AS builder
RUN pnpm install --filter openskool --filter app... --frozen-lockfile --offline
RUN pnpm turbo run --filter app... build
RUN npx pkg \
  --output import-meta-env \
  --targets node18-linux \
  app/node_modules/@import-meta-env/cli/bin/import-meta-env.js

FROM nginx:1.23.1 AS production
COPY --from=builder /opt/app/.env.example /opt/.env.example
COPY --from=builder /opt/app/dist /var/www
COPY --from=builder /opt/app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /opt/app/start.sh /opt/start.sh
COPY --from=builder /opt/import-meta-env /opt/import-meta-env
CMD ["sh", "/opt/start.sh"]
EXPOSE 80
