FROM node:20.15.0-alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
