# Use Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Set default environment variables
ARG RAILWAY_ENVIRONMENT

# Copy the package.json and pnpm-lock.yaml first for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the TypeScript files
RUN pnpm run build

# Expose the port (if your app runs on a port, adjust if necessary)
EXPOSE 3000

# Start the app using the compiled JavaScript files
CMD ["pnpm", "start:build"]
