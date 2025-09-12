FROM node:18-alpine

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose ports
EXPOSE 19000 19001 19002 19006

# Start Expo development server
CMD ["npx", "expo", "start", "--web", "--lan"]
