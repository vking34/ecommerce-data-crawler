FROM node:12.18.4-alpine

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3003
RUN npm run build
CMD [ "npm", "run", "start" ]
