FROM node:22-bookworm-slim

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Enable pnpm through Corepack
RUN corepack enable

# Install project dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the application source
COPY . .

# Generate Prisma Client and build Next.js
RUN pnpm exec prisma generate
RUN pnpm build

# Allow the non-root user to write Next.js caches
RUN mkdir -p .next/cache && chown -R node:node .next

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

USER node

CMD ["pnpm", "start"]
