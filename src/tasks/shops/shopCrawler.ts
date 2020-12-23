import { SHOPEE_API } from '../../constants/api';
import axios from 'axios';
import ShopeeShopModel from '../../models/shopeeShop';
import filterPhoneNumbers from '../../utils/phoneNumberFilter';
import { Platforms } from '../../constants/common';

const crawlShop = async (shopName: string) => {
    
    try {
        let shop = await ShopeeShopModel.findOne({'account.username': shopName});
        if (shop === null) {
            const shopDetailUrl = `${SHOPEE_API}/v4/shop/get_shop_detail?username=${shopName}`;
            // console.log(shopDetailUrl);
            try {
                const shopDetailResponse = await axios.get(shopDetailUrl, { timeout: 10000 });
                let shop = shopDetailResponse.data.data;
                shop._id = `${Platforms.shopee}.${shop.shopid}`;
                shop.phone_numbers = filterPhoneNumbers(shop.description);
                
                ShopeeShopModel.create(shop).catch(_e => { });
                // console.log('saving shop:', shopName);
            }
            catch (_e) {
                console.log('can not get shop:', shopName, _e);
            }
        }
        else {
            // console.log('saved shop:', shopName);
        }
    }
    catch (e) {
        console.log('can not find shop:', shopName, e);
    }
}


export const crawlShopByUrl = (shopLink: string) => {
    const shopUrl = new URL(shopLink);
    const shopName = shopUrl.pathname.substring(1);
    crawlShop(shopName);
}

export default crawlShop;