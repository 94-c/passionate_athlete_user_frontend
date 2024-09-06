# Base image
FROM node:16-alpine as build

# Build argument for environment variable
ARG REACT_APP_API_BASE_URL

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set environment variable
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the application
RUN npm run build

# Use Nginx as the production server
FROM nginx:stable-alpine

# Set timezone and configure Nginx
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone

# Copy the built application to the Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Remove default Nginx config and replace with custom config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
