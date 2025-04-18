# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN echo "Contents of /app before build:"
RUN ls -al /app

RUN npm run build

RUN echo "Contents of /app after build:"
RUN ls -al /app

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
# COPY --from=builder /app/.next /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]