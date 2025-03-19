FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev", "--", "--host"] 