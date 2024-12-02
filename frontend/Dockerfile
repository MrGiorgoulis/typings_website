# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the application source code
COPY . .

# Build the React app for production
RUN yarn build

# Stage 2: Serve the React app with Nginx
FROM nginx:stable-alpine

# Copy the built React app to Nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expose the Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
