# Stage 1: Build ứng dụng
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -la /app/dist  # Debug: kiểm tra dist/

# Stage 2: Phục vụ với Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html  # Debug: kiểm tra copy
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]