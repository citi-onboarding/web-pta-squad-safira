FROM node:22-alpine AS base

WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
# corepack install reads the pinned version from "packageManager" and caches
# both the launcher and the native pnpm binary in this layer, so later stages
# reuse them instead of downloading pnpm again.
RUN corepack enable
COPY package.json ./
RUN corepack install && pnpm --version

FROM base AS dependencies

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm rebuild && pnpm build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
