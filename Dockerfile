# syntax=docker.io/docker/dockerfile:1

FROM node:20-slim AS base

# 1. Install dependencies only when needed
FROM base AS deps

WORKDIR /app

COPY package.json .npmrc* ./

RUN npm install

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# S3 Args
ARG S3_ENDPOINT="http://build-time-placeholder"
ARG S3_REGION="garage"
ARG S3_BUCKET="placeholder-bucket"
ARG S3_ACCESS_KEY_ID="placeholder-key"
ARG S3_SECRET_ACCESS_KEY="placeholder-secret"
ARG S3_FORCE_PATH_STYLE="true"

ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_REGION=$S3_REGION
ENV S3_BUCKET=$S3_BUCKET
ENV S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
ENV S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY
ENV S3_FORCE_PATH_STYLE=$S3_FORCE_PATH_STYLE

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  set -a && . ./stack.env && set +a && \
  npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 -g nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "set -a && . /secrets/s3.env && set +a && node server.js"]