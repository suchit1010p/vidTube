# ==============================================================================
# Production Dockerfile for Backend (Node.js Express API)
# Optimized for Google Cloud Run, AWS ECS, Render, and Docker Compose
# ==============================================================================

# Use official Node.js 20 slim image (compatible with native modules like bcrypt)
FROM node:20-slim

# Set working directory inside container
WORKDIR /usr/src/app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy all backend source files
COPY . .

# Create temporary upload directory required by multer and set ownership
RUN mkdir -p public/temp && chown -R node:node /usr/src/app

# Run as non-root user for security
USER node

# Production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (Google Cloud Run uses 8080 by default)
EXPOSE 8080

# Start application
CMD ["node", "src/index.js"]
