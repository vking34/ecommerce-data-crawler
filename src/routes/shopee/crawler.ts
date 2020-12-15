import ShopeeShopState from '../../models/shopeeShopState';
import { crawlProductsByShopId } from '../../tasks/productsCrawler';

export default async () => {
    const shops = await ShopeeShopState.find({state: {$ne: 'DONE'}})
    if (shops) {
        for (let i = 0; i < shops.length; i++) {
            const shopId: any = shops[i];
            await crawlProductsByShopId(shopId.shop_id);
        }
    }
}