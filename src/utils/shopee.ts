import { SHOPEE_API } from '../constants/api';
import axios from 'axios';
import ShopeeProductModel from '../models/chozoiProduct'; 
import { sleep } from './common'
export const getShopDetail = async (shopName: string) => {
    const shopDetailUrl = `${SHOPEE_API}/v4/shop/get_shop_detail?username=${shopName}`;
    const response = await axios.get(shopDetailUrl);
    return response.data.data;
}

export const markProduct= async (shop) => {

   let productList = await ShopeeProductModel.find({ platform: shop});
   for(let i = 0; i <=productList.length; i++ ){
       const product = productList[i]
        await sleep(5000);
        console.log(product._id);
        
   }
           

        
        
   
   
}