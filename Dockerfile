# ==========================================
# Stage 1: Build the Vite Application
# ==========================================
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy full application source code
COPY . .

# Build Vite SPA output to /app/dist
RUN npm run build

# ==========================================
# Stage 2: Serve with Lightweight Nginx
# ==========================================
FROM nginx:1.25-alpine AS production-stage

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static web bundle from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for container traffic
EXPOSE 80

# Launch Nginx web server
CMD ["nginx", "-g", "daemon off;"]
