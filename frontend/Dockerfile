# # ---------- Build stage ----------
# FROM node:20-alpine AS build

# WORKDIR /app

# # Force stable npm registry + increase timeout
# RUN npm config set registry https://registry.npmjs.org/
# RUN npm config set fetch-retries 5
# RUN npm config set fetch-retry-mintimeout 20000
# RUN npm config set fetch-retry-maxtimeout 120000

# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# COPY . .
# RUN npm run build

# # ---------- Production stage ----------
# FROM nginx:alpine

# COPY --from=build /app/build /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]





# ---------- build stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy already-built frontend
COPY build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
