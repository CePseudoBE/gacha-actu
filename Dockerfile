# -------- Base (Debian slim, stable) --------
FROM node:22-slim AS base

# -------- Deps (cache des deps prod) --------
FROM base AS deps
# openssl nécessaire pour Prisma; libc6-dev pour certaines builds natives
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl libc6-dev ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copie des manifestes et du schéma Prisma (pour npx prisma generate)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Installe uniquement les deps de prod pour maximiser le cache
RUN npm ci --only=production && npm cache clean --force

# -------- Build --------
FROM base AS builder
# Prisma a aussi besoin d'openssl à la build
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Reprend node_modules (prod) puis ajoute le code + installe les devDeps nécessaires au build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm ci

# Génère le client Prisma (si utilisé)
RUN npx prisma generate

# Build Next.js (produit .next/standalone et .next/static avec output: 'standalone')
RUN npm run build

# -------- Runner (image finale légère) --------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# User non-root
RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 nextjs

# Copie minimale requise au runtime
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Healthcheck: curl
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -fsS http://localhost:3000/api/health || exit 1