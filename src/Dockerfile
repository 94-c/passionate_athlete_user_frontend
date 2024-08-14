# Stage 1: Build React application
FROM node:18 AS build
WORKDIR /app

# Copy the source code
COPY ../package.json ../package-lock.json ./
RUN npm install

COPY src/ .

# Build the React app
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration from the parent directory
COPY ../nginx.conf /etc/nginx/nginx.conf

# Expose the port the app runs on
EXPOSE 3000

# Start Nginx server with custom configuration
CMD ["nginx", "-g", "daemon off;"]
