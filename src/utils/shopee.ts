import { SHOPEE_API } from '../constants/api';
import axios from 'axios';


export const getShopDetail = async (shopName: string) => {
    const shopDetailUrl = `${SHOPEE_API}/v4/shop/get_shop_detail?username=${shopName}`;
    const response = await axios.get(shopDetailUrl);
    return response.data.data;
}
