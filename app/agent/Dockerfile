# --------------------------
# Stage 1: Builder
# --------------------------
FROM node:18-slim AS builder

# Install dependencies and Ollama CLI
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://ollama.com/install.sh | bash

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Copy project files
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn/ .yarn/
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --immutable

# Build TypeScript files
COPY . .
RUN yarn run build

# --------------------------
# Stage 2: Production
# --------------------------
FROM node:18-slim

# Install runtime dependencies and Ollama CLI
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://ollama.com/install.sh | bash

# Set production environment
ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn/ .yarn/

# Install production dependencies
RUN yarn install --immutable

# Expose necessary ports
EXPOSE 3000 11434

# Start Ollama and the Node.js app
CMD ["sh", "-c", "ollama serve & yarn start"]
