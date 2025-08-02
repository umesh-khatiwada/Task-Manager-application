# Use official minimal Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create .env from template (will be overridden by Kubernetes env vars)
COPY .env.template .env

# Create a default .env file with production defaults
RUN echo "NODE_ENV=production" > .env && \
    echo "PORT=8000" >> .env && \
    echo "JWT_EXPIRE=7d" >> .env && \
    echo "CLIENT_URL=http://localhost:3000" >> .env

# Expose the port your app runs on
EXPOSE 8000

# Define a healthcheck to ensure the container is responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "server.js"]
