import { getShopDetail } from '../../utils/shopee';
import { crawlProductsByShopId } from '../products/productsCrawler';
import filterPhoneNumbers from '../../utils/phoneNumberFilter';
import { Platforms } from '../../constants/common';
import ChozoiShop from '../../models/chozoiShop';

const markShop = (shopLink: string, shopIds: string[]) => {
    return new Promise(async (resolve, reject) => {
        const shopUrl = new URL(shopLink);
        const shopName = shopUrl.pathname.substring(1);

        try {
            const shopState: any = await ChozoiShop.find({ username: shopName });
            if (shopState.length === 0) {
                const shopDetail = await getShopDetail(shopName);
                const shopId: string = shopDetail.shopid;
                const newLink: string = `https://${shopUrl.hostname}${shopUrl.pathname}`;
                const phoneNumers = filterPhoneNumbers(shopDetail.description)
                console.log('phone set:', phoneNumers);
                let portrait = '', cover = '';
                if( shopDetail.account.portrait !== ''){
                    portrait = `https://cf.shopee.vn/file/${shopDetail.account.portrait}_tn`
                }
                if( shopDetail.cover !== '')
                {
                    cover = `https://cf.shopee.vn/file/${shopDetail.cover}`;
                }
                shopIds.push(shopId);
                ChozoiShop.create({
                    _id: `${Platforms.shopee}.${shopId}`,
                    username:shopDetail.account.username,
                    phone_numbers: phoneNumers,
                    name: shopDetail.name,
                    img_avatar_url: portrait,
                    img_cover_url: cover,
                    description: shopDetail.description,
                    link: newLink,
                    state: 'INIT'
                })
                
                resolve(true);
            }
            else {
                resolve(false);
            }
        }
        catch (e) {
            console.log(shopName, ' can not save:', e);
            reject(e);
        }
    });
}


export default async (shopLinks: string[]) => {
    let shopIds: string[] = [];
    for (let i = 0; i < shopLinks.length; i++) {
        const shopLink: string = shopLinks[i];
        await markShop(shopLink, shopIds);
    };
    let shopId: string = shopIds.shift();
    
    while (shopId) {
        console.log('Shop ID:', shopId);
        await ChozoiShop.updateOne({ shop_id: shopId }, { state: 'PROCESSING' });
        await crawlProductsByShopId(shopId);
        await ChozoiShop.updateOne({ shop_id: shopId }, { state: 'DONE' });
        shopId = shopIds.shift();
    }
}