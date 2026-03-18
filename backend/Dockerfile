# ============================================
# Backend Dockerfile - Multi-stage build
# ============================================
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci --only=production && \
    npx prisma generate

# Build
FROM base AS builder
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

RUN mkdir -p logs && chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]

