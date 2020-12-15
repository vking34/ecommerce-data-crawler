FROM node:12.18.4-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3003
RUN npm run build
CMD [ "npm", "run", "start" ]
