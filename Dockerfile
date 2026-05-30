FROM node:20-alpine AS builder

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]