# -----------------------------
# !Base: Alpine + Turbo
# -----------------------------
  FROM node:20.18-alpine AS base
  WORKDIR /repo
  RUN apk update && apk add --no-cache libc6-compat openssl
  RUN npm install -g turbo
  
  # -----------------------------
  # !Builder: Copy everything + prune for "admin"
  # -----------------------------
  FROM base AS builder
  COPY . .
  RUN npm install --legacy-peer-deps
  RUN turbo prune admin --docker
  
  # -----------------------------
  # !Installer: install only pruned deps
  # -----------------------------
  FROM base AS installer
  WORKDIR /repo
  COPY --from=builder /repo/out/json/ ./
  RUN npm install --legacy-peer-deps
  
  # -----------------------------
  # !Builder again: copy full source + generate + build admin
  # -----------------------------
  COPY --from=builder /repo/out/full/ ./
  ENV DATABASE_URL="mysql://root@database:3306/igraphical"
  ENV AUTH_APP="admin"
  RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
  RUN npm run build --workspace=admin
  
  # -----------------------------
  # !Runner: clean runtime + run next server
  # -----------------------------
  FROM node:20.18-alpine AS runner
  WORKDIR /app
  RUN apk update && apk add --no-cache nano
  RUN apk add --no-cache mysql mysql-client

  ENV DATABASE_URL="mysql://root@database:3306/igraphical"
  ENV AUTH_APP="admin"
  
  # Create user and set permissions
  RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
  
  COPY apps/admin/entrypoint.sh /app/entrypoint.sh
  RUN chmod +x /app/entrypoint.sh
  
  RUN mkdir -p /app/backups && chown -R nextjs:nodejs /app/backups

  USER nextjs
  
  # ✅ Copy build output
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/admin/.next/standalone ./
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/admin/.next/static ./apps/admin/.next/static
  COPY --from=installer --chown=nextjs:nodejs /repo/apps/admin/public ./apps/admin/public
  
  # ✅ Copy Prisma runtime files
  COPY --from=installer --chown=nextjs:nodejs /repo/packages/database/generated/client/libquery_engine-linux-musl-openssl-3.0.x.so.node \
    /app/apps/admin/.next/server/libquery_engine-linux-musl-openssl-3.0.x.so.node
  
  # ✅ Copy Prisma client & schema
  COPY --from=installer /repo/packages/database/prisma /app/packages/database/prisma
  COPY --from=installer /repo/node_modules/@prisma /app/node_modules/@prisma
  COPY --from=installer /repo/node_modules/.prisma /app/node_modules/.prisma
  COPY --from=installer /repo/node_modules/@prisma/client /app/node_modules/@prisma/client
  
  # ✅ Just in case: regenerate client (optional, but useful if schema changed externally)
  RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
 


  CMD ["/app/entrypoint.sh"]