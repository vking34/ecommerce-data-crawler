#!/bin/bash
docker-compose up -d mongodb
export PORT=3003
export MONGODB_URI=mongodb://localhost:27017/cz-crawl-data
export SHOPEE_API=http://shopee.vn/api
# npm run dev
npm run start
