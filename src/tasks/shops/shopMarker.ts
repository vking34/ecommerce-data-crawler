import { getShopDetail } from '../../utils/shopee';
import ShopeeShopState from '../../models/shopeeShopState';
import { crawlProductsByShopId } from '../products/productsCrawler';
import { regexPhone } from '../../utils/regexPhone';


const markShop = (shopLink: string, shopIds: string[]) => {
    return new Promise(async (resolve, reject) => {
        const shopUrl = new URL(shopLink);
        const shopName = shopUrl.pathname.substring(1);

        try {
            const shopState: any = await ShopeeShopState.find({ username: shopName });
            if (shopState.length === 0) {
                const shopDetail = await getShopDetail(shopName);
                const shopId: string = shopDetail.shopid;
                const newLink: string = `https://${shopUrl.hostname}${shopUrl.pathname}`;
                const phoneNumer = regexPhone(shopDetail.description)
                console.log('-------',phoneNumer);
                
                shopIds.push(shopId);
                ShopeeShopState.create({
                    _id: shopId,
                    name: shopDetail.name,
                    username: shopName,
                    phone: phoneNumer,
                    link: newLink,
                    state: 'INIT'
                });
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


export default async (shopLinks: [string]) => {
    let shopIds: string[] = [];
    for (let i = 0; i < shopLinks.length; i++) {
        const shopLink: string = shopLinks[i];
        await markShop(shopLink, shopIds);
    };
    let shopId: string = shopIds.shift();
    
    while (shopId) {
        console.log('Shop ID:', shopId);
        await ShopeeShopState.updateOne({ _id: shopId }, { state: 'PROCESSING' });
        await crawlProductsByShopId(shopId);
        await ShopeeShopState.updateOne({ _id: shopId }, { state: 'DONE' });
        shopId = shopIds.shift();
    }
}