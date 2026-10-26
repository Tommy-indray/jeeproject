# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginxinc/nginx-unprivileged:alpine

# Copy built assets to NGINX docroot
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy runtime entrypoint script
COPY --chown=nginx:nginx entrypoint.sh /docker-entrypoint.d/99-envsubst.sh
USER root
RUN chmod +x /docker-entrypoint.d/99-envsubst.sh
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:8080/health/live || exit 1

CMD ["nginx", "-g", "daemon off;"]

