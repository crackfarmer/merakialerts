FROM node:carbon-alpine

WORKDIR /merakialerts

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
