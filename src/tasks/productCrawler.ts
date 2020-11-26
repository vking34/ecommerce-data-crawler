import axios from "axios";
import { SHOPEE_API } from '../constants/api';
import ShopeeProductModel from '../models/shopeeProduct';


export default (productId: string, shopId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await ShopeeProductModel.findById(productId);
            console.log('product:', product);

            if (product === null) {
                const productApiUrl = `${SHOPEE_API}/v2/item/get?itemid=${productId}&shopid=${shopId}`;
                try {
                    const productResponse = await axios.get(productApiUrl, { timeout: 4000 });
                    let product = productResponse.data.item;
                    product._id = productId;
                    ShopeeProductModel.create(product).catch(_e => { });
                    console.log('saving product:', productId);
                    resolve(productId);
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                console.log('saved product:', productId);
                reject(productId);
            }
        }
        catch (e) {
            reject(e);
        }
    });
}