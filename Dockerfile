# ── Stage 1: deps ──────────────────────────────────────────────────────────────
# Debian (glibc) asosida: Turbopack va Tailwind v4 oxide native bindinglari
# musl/Alpine'da build paytida ishdan chiqadi, glibc'da barqaror ishlaydi.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: builder ───────────────────────────────────────────────────────────
FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Next 16 standart bundleri Turbopack PostCSS bosqichida Node worker bilan
# IPC orqali aloqa qiladi; bu prod host yadrosida (5.15) ishdan chiqadi
# ("stream closed unexpectedly"). @tailwindcss/oxide native binari o'zi
# soz ishlaydi, shu sababli webpack ishlatamiz: PostCSS in-process bajariladi,
# Turbopack worker IPC butunlay chetlab o'tiladi.
RUN npm run build -- --webpack

# ── Stage 3: runner (hardened) ─────────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Minimal non-root user (Debian-native)
RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 --gid nodejs nextjs

# Only copy what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
