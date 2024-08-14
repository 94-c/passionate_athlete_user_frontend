# Stage 1: Build React application
FROM node:18 AS build
WORKDIR /app

# Copy the package files to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code to the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the build artifacts to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration to the appropriate directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 3000

# Start Nginx server with custom configuration
CMD ["nginx", "-g", "daemon off;"]
