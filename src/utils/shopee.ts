import { SHOPEE_API } from '../constants/api';
import axios from 'axios';
import ShopeeProductModel from '../models/shopeeProduct';
export const getShopDetail = async (shopName: string) => {
    const shopDetailUrl = `${SHOPEE_API}/v4/shop/get_shop_detail?username=${shopName}`;
    const response = await axios.get(shopDetailUrl);
    return response.data.data;
}

export const markProduct= async (shop) => {
    const shopPart = shop.split('.');
    const shopId = shopPart[1];
   // const productQueue: string[] = [];

   let productList = await ShopeeProductModel.find({ shopid: shopId}).exec();
console.log(shopId);

   console.log('product',productList);
   
}