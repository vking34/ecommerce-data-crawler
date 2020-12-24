import filterPhoneNumbers from '../../utils/phoneNumberFilter';
import ShopeeShopModel from '../../models/shopeeShop'
import ChozoiShopModel from '../../models/chozoiShop';
import { crawlProductsByShopId } from '../../tasks/products/productsCrawler';


export default (shopIds: string[]) => {
    shopIds.forEach(async shopId => {
        console.log('shop id:', shopId);

        try {
            const shopChozoi = await ChozoiShopModel.findById(shopId);
            console.log('cz shop:', shopChozoi);

            if (shopChozoi == null) {
                const result: any = await ShopeeShopModel.findById(shopId);
                // [ '$__', 'isNew', 'errors', '$locals', '$op', '_doc', '$init' ]
                let shopDetail = result._doc;

                const shopeeShopId: string = shopDetail.shopid;
                const newLink: string = `https://shopee.vn/${shopDetail.account.username}`;
                const phoneNumers = filterPhoneNumbers(shopDetail.description);
                let portrait = '', cover = '';
                if (shopDetail.account.portrait !== '') {
                    portrait = `https://cf.shopee.vn/file/${shopDetail.account.portrait}_tn`
                }
                if (shopDetail.cover !== '') {
                    cover = `https://cf.shopee.vn/file/${shopDetail.cover}`;
                }

                const shop = {
                    _id: shopId,
                    username: shopDetail.account.username,
                    phone_numbers: phoneNumers,
                    name: shopDetail.name,
                    img_avatar_url: portrait,
                    img_cover_url: cover,
                    description: shopDetail.description,
                    link: newLink,
                    state: 'PROCESSING'
                }
                // console.log(shop);
                await ChozoiShopModel.create(shop);
                await ShopeeShopModel.updateOne({ _id: shopId }, { is_crawled: true });
                await crawlProductsByShopId(shopeeShopId);
                await ChozoiShopModel.updateOne({ shop_id: shopId }, { state: 'DONE' });
            }
            else {
                console.log('crawled shop:', shopId);
            }
        }
        catch (e) {
            console.log(shopId, ' can not save:', e);
        }
    })
}