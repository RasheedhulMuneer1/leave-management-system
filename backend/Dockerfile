# Use lightweight Node image
FROM node:20-alpine

WORKDIR /app

# Copy package files for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy built files and node_modules
COPY dist ./dist
COPY node_modules ./node_modules
COPY package.json ./
COPY wait-for-oracle.sh ./

# Give execution permission to wait script inside container
RUN chmod +x ./wait-for-oracle.sh

# Expose NestJS port
EXPOSE 3002

# Start container with wait-for-oracle script
CMD ["./wait-for-oracle.sh"]
