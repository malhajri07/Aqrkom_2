# Aqarkom - Multi-stage build
# Based on PRD Tech Architecture: Docker, GCP Cloud Run

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared packages/shared
COPY apps/web apps/web
COPY apps/api apps/api

# Install dependencies and build
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm build

# Production stage - API
FROM node:20-alpine AS api

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]

# Optional: Frontend served via nginx (for static deployment)
FROM nginx:alpine AS web

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
