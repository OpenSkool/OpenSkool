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

FROM nginx:1.23.1-alpine AS production
COPY --from=base-builder /opt/app/dist /var/www
COPY --from=base-builder /opt/app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
