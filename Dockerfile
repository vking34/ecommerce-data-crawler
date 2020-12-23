FROM node:12.18.4-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3003
CMD [ "npm", "run", "start" ]
