FROM node:20-alpine AS builder

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm ci

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

COPY . .

RUN npm run build


FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/src/app/frontend/dist /usr/share/caddy/html

EXPOSE 80 443


CMD ["caddy","run","--config","/etc/caddy/Caddyfile"]