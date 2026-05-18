# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_R2_NOTIF_DEBUG=false
ARG VITE_R2_NOTIFY_SVR
ARG VITE_R2_NOTIFY_AUTO_CONNECT=false
ARG VITE_PLAYGROUND_API_KEY

# Set environment variables for build
ENV VITE_R2_NOTIF_DEBUG=$VITE_R2_NOTIF_DEBUG
ENV VITE_R2_NOTIFY_SVR=$VITE_R2_NOTIFY_SVR
ENV VITE_R2_NOTIFY_AUTO_CONNECT=$VITE_R2_NOTIFY_AUTO_CONNECT
ENV VITE_PLAYGROUND_API_KEY=$VITE_PLAYGROUND_API_KEY

# Build the app
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]