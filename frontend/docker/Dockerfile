FROM node:20.15.0-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
