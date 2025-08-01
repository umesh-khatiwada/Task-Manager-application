# Backend Dockerfile - Minimal and reliable
FROM node:18-alpine

WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Simple health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "server.js"]
