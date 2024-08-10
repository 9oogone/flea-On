FROM node:20.15.0-alpine

WORKDIR /front

COPY package.json .

ENV NODE_ENV=production
ENV REACT_APP_LOGIN_BOOL=true

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
