import ShopeeShopState from '../../models/shopState';
import { crawlProductsByShopId } from '../products/productsCrawler';
import schedule from 'node-schedule';

const crawl = async () => {
    const shops = await ShopeeShopState.find({ state: { $ne: 'DONE' } })
    if (shops.length !== 0) {
        for (let i = 0; i < shops.length; i++) {
            const shopId: any = shops[i];
            await crawlProductsByShopId(shopId.shop_id);
            await ShopeeShopState.updateOne({ shop_id: shopId }, { state: 'DONE' });
        }
    }
}

export default () => {
    const cronExpress = '0 0 21 */2 * *';

    schedule.scheduleJob(cronExpress, function () {
        crawl();
    });


}
