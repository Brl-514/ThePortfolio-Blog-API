FROM node:18-alpine AS base

WORKDIR /app

# Only install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose API port and set env defaults
ENV PORT=5000 \
    NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]

