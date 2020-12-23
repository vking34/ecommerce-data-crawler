#!/bin/bash
docker-compose up -d
export PORT=3003
export MONGODB_URI=mongodb://localhost:27017/cz-crawl-data
export SHOPEE_API=http://shopee.vn/api
export AUTO_INDEX=true
export CHOZOI_API=https://api.chozoi.com
npm run dev
# npm run start
