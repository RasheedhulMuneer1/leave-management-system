# # 1. Base image
# FROM node:18

# # 2. Set working directory
# WORKDIR /app

# # 3. Copy package.json and install dependencies
# COPY package*.json ./
# RUN npm install

# # 4. Copy rest of the backend code
# COPY . .

# # 5. expose port
# EXPOSE 3000

# # 6. start the NestJS app
# CMD ["npm", "run", "start:prod"]



FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"]
