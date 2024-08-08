FROM node:20.15.0-alpine

WORKDIR /front

COPY package.json .

ENV NODE_ENV=production

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
