# -----------------------------
# !Base: Alpine + Turbo
# -----------------------------
  FROM node:20.18-alpine AS base
  WORKDIR /repo
  RUN apk update && apk add --no-cache libc6-compat openssl
  RUN npm install -g turbo

  # -----------------------------
  #! Deps (install once)
  # -----------------------------
  FROM base AS deps
  COPY package.json turbo.json ./
  COPY packages/ ./packages/
  COPY apps/app ./apps/app
  RUN npm install --legacy-peer-deps
  
  # -----------------------------
  # !Builder: Copy everything + prune for "app"
  # -----------------------------
  FROM deps AS builder
  COPY . .
  RUN turbo prune app --docker
  
  # -----------------------------
  #! Installer (copy pruned files + use existing node_modules)
  # -----------------------------
  FROM deps AS installer
  WORKDIR /repo
  COPY --from=builder /repo/out/json/ ./
  COPY --from=builder /repo/out/full/ ./

  # these are some 
  ARG RESEND_API_KEY
  ENV RESEND_API_KEY=${RESEND_API_KEY}
  ARG DATABASE_URL
  ENV DATABASE_URL=${DATABASE_URL}
  ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
  ENV NEXT_PUBLIC_BASE_URL="https://igraphical.ir"
  ENV AUTH_APP="app"

  RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
  RUN npm run build --workspace=app
  
  # -----------------------------
  # !Runner: clean runtime + run next server
  # -----------------------------
  FROM node:20.18-alpine AS runner
  WORKDIR /app
  RUN apk update && apk add --no-cache nano curl mysql mysql-client

  # Create user and set permissions
  RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
  
  COPY apps/app/entrypoint.sh /app/entrypoint.sh
  RUN chmod +x /app/entrypoint.sh
  
  RUN mkdir -p /app/backups && chown -R nextjs:nodejs /app/backups

  USER nextjs
  
  # ✅ Copy build output
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/app/.next/standalone ./
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/app/.next/static ./apps/app/.next/static
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/app/public ./apps/app/public
  
  # ✅ Copy Prisma runtime files
  COPY --from=installer --chown=nextjs:nodejs /repo/packages/database/generated/client/libquery_engine-linux-musl-openssl-3.0.x.so.node \
    /app/apps/app/.next/server/libquery_engine-linux-musl-openssl-3.0.x.so.node
  
  # ✅ Copy Prisma client & schema
  COPY --from=installer /repo/packages/database/prisma /app/packages/database/prisma
  COPY --from=installer /repo/node_modules/@prisma /app/node_modules/@prisma
  COPY --from=installer /repo/node_modules/.prisma /app/node_modules/.prisma
  COPY --from=installer /repo/node_modules/@prisma/client /app/node_modules/@prisma/client
   

  CMD ["/app/entrypoint.sh"]