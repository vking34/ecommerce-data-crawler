import axios from "axios";
import { SHOPEE_API } from '../../constants/api';
import ShopeeProductModel from '../../models/shopeeProduct';
import ShopeeProductId from "../../models/shopeeProductId";

export default (productId: string, shopId: string) => {
    return new Promise(async (resolve, _reject) => {
        try {
            let product = await ShopeeProductModel.findById(productId);

            if (product === null) {
                const productApiUrl = `${SHOPEE_API}/v2/item/get?itemid=${productId}&shopid=${shopId}`;
                try {
                    const productResponse = await axios.get(productApiUrl, { timeout: 4000 });
                    let product = productResponse.data.item;
                    product._id = productId;
                    ShopeeProductModel.create(product).catch(_e => { });
                    console.log('saving product:', productId);
                    resolve(1);
                }
                catch (e) {
                    console.log('can not get:', productId);
                    await ShopeeProductId.updateOne({ shop_id: shopId}, { state: "FAIL"});
                    resolve(0);
                }
            }
            else {
                console.log('saved product:', productId);
                resolve(1);
            }
        }
        catch (e) {
            resolve(0);
        }
    });
}