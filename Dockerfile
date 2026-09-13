# ============================================================================
# Stage 1: Build the React 19 + TypeScript + Three.js/Globe.gl Frontend
# ============================================================================
FROM node:22-alpine AS build-frontend
WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm install

# Copy frontend source and build production static bundle
COPY client/ ./
RUN npm run build

# ============================================================================
# Stage 2: Production Node.js / Express + Cloud Firestore Server
# ============================================================================
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV FIRESTORE_DATABASE_ID=operationruberduck-db

# Create persistent data directory for local fallback / cache
RUN mkdir -p /app/server/data && chmod 777 /app/server/data

# Install backend dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --only=production

# Copy backend source code and automated test suite
COPY server/ ./

# Copy built frontend static bundle into server/public
COPY --from=build-frontend /app/client/dist ./public

# Expose Google Cloud Run standard port
EXPOSE 8080

# Launch Express server connected to Cloud Firestore (operationruberduck-db)
CMD ["node", "index.js"]
