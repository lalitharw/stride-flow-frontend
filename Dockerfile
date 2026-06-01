FROM node:20-alpine AS builder

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM caddy:alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/src/app/frontend/dist /usr/share/caddy/html

EXPOSE 80 443


CMD ["caddy","run","--config","/etc/caddy/Caddyfile"]