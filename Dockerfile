# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the TypeScript files
RUN pnpm run build

# Expose the port that your app will run on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
