import ShopeeShopState from '../../models/shopeeShopState';
import { crawlProductsByShopId } from '../../tasks/productsCrawler';


export default async () => {
    const shops = await ShopeeShopState.find({ state: { $ne: 'DONE' } })
    if (shops.length !== 0) {
        for (let i = 0; i < shops.length; i++) {
            const shopId: any = shops[i];
            await crawlProductsByShopId(shopId.shop_id);
            await ShopeeShopState.updateOne({ shop_id: shopId }, { state: 'DONE' });
        }
    }
}