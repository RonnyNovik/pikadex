# Use Node.js LTS with full image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose API port
EXPOSE 3000
COPY scripts/start.sh .
RUN chmod +x start.sh

# Start the server using our script
CMD ["./start.sh"]