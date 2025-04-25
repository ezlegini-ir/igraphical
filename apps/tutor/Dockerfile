# -----------------------------
# !Base: Alpine + Turbo
# -----------------------------
    FROM node:20.18-alpine AS base
    WORKDIR /repo
    RUN apk update && apk add --no-cache libc6-compat openssl
    RUN npm install -g turbo
    
    # -----------------------------
    # !Builder: Copy everything + prune for "tutor"
    # -----------------------------
    FROM base AS builder
    COPY . .
    RUN npm install --legacy-peer-deps
    RUN turbo prune tutor --docker
    
    # -----------------------------
    # !Installer: install only pruned deps
    # -----------------------------
    FROM base AS installer
    WORKDIR /repo
    COPY --from=builder /repo/out/json/ ./
    RUN npm install --legacy-peer-deps
    
    # -----------------------------
    # !Builder again: copy full source + generate + build tutor
    # -----------------------------
    COPY --from=builder /repo/out/full/ ./

    # Arguments needed for build
    ARG RESEND_API_KEY
    ENV RESEND_API_KEY=${RESEND_API_KEY}
    ARG DATABASE_URL
    ENV DATABASE_URL=${DATABASE_URL}
    ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
    ENV AUTH_APP="tutor"

    RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
    RUN npm run build --workspace=tutor
    
    # -----------------------------
    # !Runner: clean runtime + run next server
    # -----------------------------
    FROM node:20.18-alpine AS runner
    WORKDIR /app
    RUN apk update && apk add --no-cache nano
    RUN apk add --no-cache mysql mysql-client
    
    # Create user and set permissions
    RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
    
    COPY apps/tutor/entrypoint.sh /app/entrypoint.sh
    RUN chmod +x /app/entrypoint.sh
    
    RUN mkdir -p /app/backups && chown -R nextjs:nodejs /app/backups

    USER nextjs
    
    # ✅ Copy build output
    COPY --from=installer --chown=nextjs:nodejs /repo/apps/tutor/.next/standalone ./
    COPY --from=installer --chown=nextjs:nodejs /repo/apps/tutor/.next/static ./apps/tutor/.next/static
    COPY --from=installer --chown=nextjs:nodejs /repo/apps/tutor/public ./apps/tutor/public
    
    # ✅ Copy Prisma runtime files
    COPY --from=installer --chown=nextjs:nodejs /repo/packages/database/generated/client/libquery_engine-linux-musl-openssl-3.0.x.so.node \
      /app/apps/tutor/.next/server/libquery_engine-linux-musl-openssl-3.0.x.so.node
    
    # ✅ Copy Prisma client & schema
    COPY --from=installer /repo/packages/database/prisma /app/packages/database/prisma
    COPY --from=installer /repo/node_modules/@prisma /app/node_modules/@prisma
    COPY --from=installer /repo/node_modules/.prisma /app/node_modules/.prisma
    COPY --from=installer /repo/node_modules/@prisma/client /app/node_modules/@prisma/client
    
    # ✅ Just in case: regenerate client (optional, but useful if schema changed externally)
    RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
   


    CMD ["/app/entrypoint.sh"]