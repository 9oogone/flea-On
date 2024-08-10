FROM node:20.15.0-alpine

WORKDIR /front

COPY package.json .

ENV NODE_ENV=production
ENV REACT_APP_VAPID_TOKEN=BAdvQf63BQCQQIupbORKrWcMBMOd_05CXsT4xB3UTLXfiMxNDA7MJX0vQz3j1pah5JBYRm3qUp_d4qN-06KUk0I
ENV REACT_APP_LOGIN_BOOL=true

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
