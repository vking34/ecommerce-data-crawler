import ProductIdModel from '../models/shopeeProductId';
import saveProduct from './productCrawler';


export const crawlProductsByShopId = async (shopId: string) => {
    try {
        const productIds = await ProductIdModel.find({ shop_id: shopId });
        if (productIds) {
            for (let i = 0; i < productIds.length; i++) {
                const productId: any = productIds[i];
                await saveProduct(productId.product_id, productId.shop_id);
            }
        }
    } catch (e) {
        console.log('can not products in shop:', shopId);
    }
}