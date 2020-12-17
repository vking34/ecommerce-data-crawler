import ProductIdModel from '../../models/shopeeProductId';
import saveProduct from './productCrawler';
import ShopState from '../../models/shopeeShopState';


export const crawlProductsByShopId = async (shopId: string) => {
    try {
        const shop = await ShopState.findById(shopId);
        let phoneNumbers = new Set(shop.phone_numbers);
        
        const productIds = await ProductIdModel.find({ shop_id: shopId });
        if (productIds) {
            for (let i = 0; i < productIds.length; i++) {
                const productId: any = productIds[i];
                await saveProduct(productId.product_id, productId.shop_id, phoneNumbers);
            }
        }
        
        await ShopState.updateOne({_id: shopId}, {phone_numbers: [...phoneNumbers]});
    } catch (e) {
        console.log('can not products in shop:', shopId);
    }
}