# Stage 1: Build the Vue app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_HOST=${VITE_API_HOST}
ENV VITE_API_HOST=${VITE_API_HOST}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
