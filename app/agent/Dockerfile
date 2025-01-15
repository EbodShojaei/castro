# --------------------------
# Stage 1: Builder
# --------------------------
    FROM node:18-slim AS builder

    # Install CA certificates to avoid TLS errors
    RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /app
    
    RUN corepack enable && corepack prepare yarn@4.6.0 --activate
    
    # Ensure Yarn sees nodeLinker setting to avoid PnP
    COPY .yarnrc.yml .yarnrc.yml
    COPY .yarn/ .yarn/
    
    # Copy package files
    COPY package.json yarn.lock ./
    
    # Install all dependencies
    RUN yarn install --immutable
    
    # Copy remaining source code
    COPY . .
    
    # TypeScript is installed to build
    RUN yarn run build
    
    
    # --------------------------
    # Stage 2: Production
    # --------------------------
    FROM node:18-slim

    # Install CA certificates to avoid TLS errors
    RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*
    
    # For final runtime image
    ENV NODE_ENV=production
    WORKDIR /app
    
    RUN corepack enable && corepack prepare yarn@4.6.0 --activate
    
    # Overrides PnP for node_modules:
    COPY .yarnrc.yml .yarnrc.yml
    COPY .yarn/ .yarn/
    
    # Copy compiled build output and essential package files
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/yarn.lock ./yarn.lock
    
    # Install production dependencies as node_modules
    RUN yarn install --immutable
    
    # Final command
    CMD ["node", "dist/index.js"]
    