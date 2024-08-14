# Stage 1: Build React application
FROM node:18 AS build
WORKDIR /app

# Copy the source code
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
