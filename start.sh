#!/bin/bash
docker-compose up -d
export PORT=3003
export MONGODB_URI=mongodb://localhost:27017/cz-crawl-data
export SHOPEE_API=http://shopee.vn/api
export AUTO_INDEX=true
npm run dev
# npm run start
