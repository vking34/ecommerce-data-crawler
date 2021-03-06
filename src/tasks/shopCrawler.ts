import { SHOPEE_API } from '../constants/api';
import axios from 'axios';
import ShopeeShopModel from '../models/shopeeShop';


const crawlShop = async (shopName: string) => {
    // console.log(shopName);
    try {
        let shop = await ShopeeShopModel.findById(shopName);
        if (shop === null) {
            const shopDetailUrl = `${SHOPEE_API}/v4/shop/get_shop_detail?username=${shopName}`;
            console.log(shopDetailUrl);
            try {
                const shopDetailResponse = await axios.get(shopDetailUrl, { timeout: 4000 });
                let shop = shopDetailResponse.data.data;
                shop._id = shopName;
                ShopeeShopModel.create(shop).catch(_e => { });
                console.log('saving shop:', shopName);
            }
            catch (_e) {
                console.log('can not get shop:', shopName);
            }
        }
        else {
            console.log('saved shop:', shopName);
        }
    }
    catch (e) {
        console.log('can not get shop:', shopName);
    }
}


export const crawlShopByUrl = (shopLink: string) => {
    const shopUrl = new URL(shopLink);
    const shopName = shopUrl.pathname.substring(1);
    crawlShop(shopName);
}

export default crawlShop;