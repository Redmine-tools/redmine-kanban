FROM node:18-alpine as builder
WORKDIR '/app'
ARG VUE_APP_BACKEND_URL
ENV VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder app/dist /usr/share/nginx/html
