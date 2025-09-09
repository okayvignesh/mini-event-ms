# Use an official Node.js image for ARM64 (Ampere uses ARM architecture)
FROM node:20-bullseye-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use npm ci if package-lock.json exists for reproducibility)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose backend port (adjust if your backend uses a different port)
EXPOSE 4003

# Start the backend
CMD ["npm", "start"]