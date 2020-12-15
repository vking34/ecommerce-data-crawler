import ShopeeProductId from "../../models/shopeeProductId";
import saveProduct from '../productCrawler';

export default () => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await ShopeeProductId.find({ state: "FAIL" })
            if (products.length !== 0) {
                for (let i = 0; i < products.length; i++) {
                    const productId: any = products[i];
                    await saveProduct(productId.product_id, productId.shop_id);
                }
            }
            resolve(true);
        }
        catch (e) {
            reject(e)
        }
    })
}