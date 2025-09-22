FROM node:18-alpine

# Install pnpm and Expo CLI globally
RUN npm install -g pnpm @expo/cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy application code
COPY . .

# Expose ports
EXPOSE 19000 19001 19002 19006

# Start Expo development server
CMD ["pnpm", "exec", "expo", "start", "--web", "--lan"]
