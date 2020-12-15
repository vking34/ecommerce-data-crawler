import ShopeeProductId from "../../models/shopeeProductId";
import saveProduct from '../../tasks/productCrawler';

export default () => {
    return new Promise(async (resolve, reject) => {
        try {
            const products: any = await ShopeeProductId.find({ state: "FAIL" })
            if (products) {
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