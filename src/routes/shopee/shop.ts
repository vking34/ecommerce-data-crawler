import express, { Request, Response, Router } from 'express';
import { getShopDetail } from '../../utils/shopee';
import ShopeeShopState from '../../models/shopeeShopState';
import { crawlProductsByShopId } from '../../tasks/productsCrawler';


const router: Router = express.Router();

const markShop = (shopLink: string, shopIds: string[]) => {
    return new Promise(async (resolve, reject) => {
        const shopUrl = new URL(shopLink);
        const shopName = shopUrl.pathname.substring(1);
        console.log('shop name:', shopName);

        try {
            const shopState: any = await ShopeeShopState.find({ username: shopName });
            console.log(shopState);
            
            if (shopState.length === 0) {
                const shopDetail = await getShopDetail(shopName);
                const shopId: string = shopDetail.shopid;
                const newLink: string = `https://${shopUrl.hostname}${shopUrl.pathname}`;
                shopIds.push(shopId);
                ShopeeShopState.create({
                    _id: shopId,
                    name: shopDetail.name,
                    username: shopName,
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



const markShops = async (shopLinks: [string]) => {
    let shopIds: string[] = [];
    for (let i = 0; i < shopLinks.length; i++) {
        const shopLink: string = shopLinks[i];
        await markShop(shopLink, shopIds);
    };
    console.log('done');
    let shopId: string = shopIds.shift();
    console.log(shopId);

    while (shopId) {
        await ShopeeShopState.updateOne({ _id: shopId }, { state: 'PROCESSING' });
        await crawlProductsByShopId(shopId);
        await ShopeeShopState.updateOne({ _id: shopId }, { state: 'DONE' });
        shopId = shopIds.shift();
    }
}


router.post('', (req: Request, resp: Response) => {
    const shopLinks: [string] = req.body.shops;
    resp.send({
        status: true,
        message: 'Crawling shops...'
    });

    markShops(shopLinks);
})


export default router;
