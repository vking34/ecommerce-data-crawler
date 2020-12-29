import ProductIdModel from '../../models/shopeeProductId';
import saveProduct from './productCrawler';
import ChozoiShopModel from '../../models/chozoiShop';
import { Platforms } from '../../constants/common';



export const crawlProductsByShopId = async (shopId: string) => {
    let phoneNumbers;
    try {
        const shop = await ChozoiShopModel.findOne({ shop_id: shopId });
        phoneNumbers = new Set(shop.phone_numbers);
    }
    catch (e) {
        phoneNumbers = new Set();
    }

    try {
        const productIds = await ProductIdModel.find({ shop_id: shopId });

        let _id = `${Platforms.shopee}.${shopId}`
        const totalProducts: number = productIds.length;
        await ChozoiShopModel.updateOne({ _id: _id }, { total_products: totalProducts });
        // console.log('product ids:', productIds);

        if (productIds) {
            for (let i = 0; i < totalProducts; i++) {
                const productId: any = productIds[i];
                try {
                    await saveProduct(productId.product_id, productId.shop_id, phoneNumbers);
                }
                catch (e) {
                    console.log('skip product:', productId.product_id, e);

                }
            }
        }

        await ChozoiShopModel.updateOne({ shop_id: shopId }, { phone_numbers: [...phoneNumbers] });
    } catch (e) {
        console.log('can not products in shop:', shopId);
    }
}