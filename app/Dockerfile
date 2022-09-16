FROM node:16.17.0-alpine AS base
ARG PNPM_PACKAGE=app
RUN apk add tini --no-cache
WORKDIR /opt

FROM base AS builder
RUN apk add git --no-cache
COPY package.json pnpm-lock.yaml .
RUN corepack enable && corepack prepare --activate
RUN pnpm fetch
COPY . .
RUN pnpm install --filter openskool --filter $PNPM_PACKAGE... --frozen-lockfile --offline
RUN pnpm turbo run --filter $PNPM_PACKAGE... build

FROM nginx:1.23.1-alpine AS production
ARG PNPM_PACKAGE=app
COPY --from=builder /opt/$PNPM_PACKAGE/dist /var/www
COPY --from=builder /opt/$PNPM_PACKAGE/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
